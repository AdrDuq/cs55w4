import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

export function getAllIds() {
  const filePath = path.join(dataDir, 'famousPeople.json');
  const jsonString = fs.readFileSync(filePath, 'utf8');
  const jsonObj = JSON.parse(jsonString);
  return jsonObj.map(item => {
    return {
      params: {
        id: item.id.toString()
      }
    }
  });
}

export function getSortedList() {
  const filePath = path.join(dataDir, 'famousPeople.json');
  const jsonString = fs.readFileSync(filePath, 'utf8');
  const jsonObj = JSON.parse(jsonString);
  jsonObj.sort(function (a, b) {
      return a.name.localeCompare(b.name);
  });

  return jsonObj.map(item => {
    return {
      id: item.id.toString(),
      name: item.name
    }
  });
}

export async function getData(idRequested) {
  const filePath = path.join(dataDir, 'famousPeople.json');
  const filePath2 = path.join(dataDir, 'relations.json');

  const jsonString = fs.readFileSync(filePath, 'utf8');
  const jsonString2 = fs.readFileSync(filePath2, 'utf8');

  const jsonObj = JSON.parse(jsonString);
  const jsonObj2 = JSON.parse(jsonString2);

  const objMatch = jsonObj.filter(obj => {
    return obj.id.toString() === idRequested;
  });

  let objReturned;
  if (objMatch.length > 0) {
    objReturned = objMatch[0];

    const objMatch2 = jsonObj2.filter(obj => {
        return obj.owner_id.toString() === idRequested;
      }
    );

    if (objMatch2.length > 0) {
      const objMatch3 = jsonObj.filter(obj => {
          return objMatch2[0].related_ids.includes( obj.id );
        }
      );

      if (objMatch3.length > 0) {
        objReturned.related = objMatch3;
      }
    }

  } else {
    objReturned = {};
  }

  return objReturned;
}