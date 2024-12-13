import { Box, Button, Card, Checkbox, Divider, Drawer, Input, List, ListItem, ListItemButton, ListItemText, Stack, Table, TableBody, TableCell, TableRow, Toolbar, Typography } from "@mui/material";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useState } from "react";
import db from '../Components/firebase';
import Room from "./room";
import Shop from "./shop";
import NightEntity from "./nightEntity";

export default function Bethal() {
  //Data from DB
  const [insideEntities, setInsideEntities] = useState([]);
  const [nightEntities, setNightEntities] = useState([]);
  const [moons, setMoons] = useState([]);
  const [scraps, setScraps] = useState([]);
  const [rooms, setRooms] = useState([]);

  //Processed Data.
  const [currMoon, setCurrMoon] = useState("");
  const [prevMoon, setPrevMoon] = useState("");
  const [weather, setWeather] = useState([]);
  const [roomData, setRoomData] = useState([]);
  const [chosenNightEntities, setChosenNightEntities] = useState([]);
  const [chosenDayEntities, setChosenDayEntities] = useState([]);
  const [grid, setGrid] = useState([]);
  const [time, setTime] = useState({});
  const [day, setDay] = useState(-1);
  const [round, setRound] = useState(-1);
  const [entityLocations, setEntityLocations] = useState([]);
  const [shop, setShop] = useState([]);
  const [mapGenerated, setMapGenerated] = useState(false);
  const [nightSpawned, setNightSpawned] = useState([]);
  const [dataRetrieved, setDataRetrieved] = useState(false);
  const [floodLevel, setFloodLevel] = useState(0);
  const [moonList, setMoonList] = useState(false);

  const mapSizes = [21, 18, 32, 18, 36, 23, 32, 40, 21];
  const quotas = [130, 236, 361, 517, 717, 973, 1300, 1700, 2205, 2811, 3536, 4392, 5392, 5392, 6548, 7873, 9380];

  const getData = (dataType) => {
    const q = query(collection(db, dataType));
  
    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      })
      if(dataType === 'InsideEntities') setInsideEntities(queryData)
      else if(dataType === 'NightEntities') setNightEntities(queryData);
      else if(dataType === 'Moons') setMoons(queryData);
      else if(dataType === 'Scraps') setScraps(queryData);
      else setRooms(queryData);
    })
  
    return () => {
      unsub();
    }
  }

  const getShopData = () => {
    const q = query(collection(db, 'Shop'));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      })
      setShop(queryData);
    })

    return () => {
      unsub();
    }
  }

  const getWeather = () => {
    const temp = [];
    const maxUnknown = 4;
    let unknown = 0;

    for(let i = 0; i < moons.length; i++) {
      if(unknown < maxUnknown && Math.floor(Math.random() * 2) === 1) {
        temp.push(moons[i].weather[Math.floor(Math.random() * moons[i].weather.length)] + "?");
        unknown++;
      }
      else {
        temp.push(moons[i].weather[Math.floor(Math.random() * moons[i].weather.length)]);
      }
    }

    setWeather(temp);
  }

  const determineTraps = (currTraps, roomList, moon) => {
    let data = {};

    for(let i = 0; i < 3; i++) {
      const rand = Math.floor(Math.random() * 5);
      if(rand === 1) {
        if(i === 0 && currTraps[i] < moon.maxLandmines) {
          data.landmine = true;
          currTraps[0]++;
        }
        else {
          data.landmine = false;
        }

        if(i === 1 && currTraps[i] < moon.maxTurrets) {
          data.turret = true;
          currTraps[1]++;
        }
        else {
          data.turret = false;
        }

        if(i === 2 && currTraps[i] < moon.maxSpikeTraps) {
          data.spikeTrap = true;
          currTraps[2]++;
        }
        else {
          data.spikeTrap = false;
        }
      }
      else {
        if(i === 0) data.landmine = false;
        if(i === 1) data.turret = false;
        if(i === 2) data.spikeTrap = false;
      }
    }

    roomList.push(data);
  }

  const determineScrap = (currScrap, maxScrap, roomList, moon, index) => {
    if(currScrap === maxScrap) {
      roomList[index].scraps = [];
      return;
    }

    const scrapList = [];

    const scrapCount = Math.floor(Math.random() * 3);
    for(let i = 0; i < scrapCount; i++) {
      if(currScrap < maxScrap) {
        let temp = Math.floor(Math.random() * 101); //0 to 100
        let scrapToAdd = {};

        for(let j = 1; j < moon.scrapSpawns.length; j++) {
          if(temp <= moon.scrapSpawns[0].roll) {
            for(let k = 0; k < scraps.length; k++) {
              if(scraps[k].name.toUpperCase() === moon.scrapSpawns[0].name.toUpperCase()) {
                scrapToAdd = scraps[k];
                const val = Math.floor((Math.random() * (scraps[k].maxVal - scraps[k].minVal) + scraps[k].minVal));
                scrapToAdd.value = val;
              }
            }
          }
          else if(temp > moon.scrapSpawns[j - 1].roll && temp <= moon.scrapSpawns[j].roll) {
            for(let k = 0; k < scraps.length; k++) {
              if(scraps[k].name.toUpperCase() === moon.scrapSpawns[j].name.toUpperCase()) {
                scrapToAdd = scraps[k];
                const val = Math.floor((Math.random() * (scraps[k].maxVal - scraps[k].minVal) + scraps[k].minVal));
                scrapToAdd.value = val;
              }
            }
          }
        }

        scrapList.push(scrapToAdd);
        currScrap++;
      }
    }

    roomList[index].scraps = scrapList;
    return currScrap;
  }

  const determineInsideEntity = (currEntityPower, maxEntityPower, roomList, moon, index, currentlySpawned) => {
    roomList[index].entity = {};

    if(currEntityPower >= maxEntityPower) {
      roomList[index].entity = {};
      return currEntityPower;
    }

    let temp = Math.floor(Math.random() * 101); //0 to 100
    for(let i = 1; i < moon.insideEntities.length; i++) {
      if(currEntityPower < maxEntityPower) {
        if(temp <= moon.insideEntities[0].roll) {
          for(let j = 0; j < insideEntities.length; j++) {
            if(insideEntities[j].name === moon.insideEntities[0].name) {
              if(currentlySpawned[insideEntities[j].name] === insideEntities[j].maxSpawned) {
                i--;
                temp = Math.floor(Math.random() * 101);
              }
              else {
                currentlySpawned[insideEntities[j].name] = currentlySpawned[insideEntities[j].name] + 1;
                currEntityPower = currEntityPower + insideEntities[j].power;
                roomList[index].entity = insideEntities[j];
                roomList[index].entity.spawned = false;
                return currEntityPower;
              }
            }
          }
        }
        else if(temp > moon.insideEntities[i - 1].roll && temp <= moon.insideEntities[i].roll) {
          for(let j = 0; j < insideEntities.length; j++) {
            if(insideEntities[j].name === moon.insideEntities[i].name) {
              if(currentlySpawned[insideEntities[j].name] === insideEntities[j].maxSpawned) {
                i--;
                temp = Math.floor(Math.random() * 101);
              }
              else {
                currentlySpawned[insideEntities[j].name] = currentlySpawned[insideEntities[j].name] + 1;
                currEntityPower = currEntityPower + insideEntities[j].power;
                roomList[index].entity = insideEntities[j];
                roomList[index].entity.spawned = false;
                return currEntityPower;
              }
            }
          }
        }
      }
    }
  }
  
  const determineRoomType = (roomList, currSpawned, index) => {
    let roomType = Math.floor(Math.random() * rooms.length);

    while(currSpawned[rooms[roomType].name] === rooms[roomType].maxSpawned) {
      roomType = Math.floor(Math.random() * rooms.length);
    }

    currSpawned[rooms[roomType].name]++;

    roomList[index].roomType = rooms[roomType].name;
    roomList[index].roomNum = index;
    roomList[index].placed = false;
    roomList[index].connections = [];
  }

  const determineOutsideEntities = (moon, dayList, nightList) => {
    //Day
    for(let i = 0; i < 4; i++) {
      if(moon.name === 'Offense') dayList.push(moon.daytimeEntities[0].name); //Super specific edge case.

      const roll = Math.floor(Math.random() * 101);
      for(let j = 1; j < moon.daytimeEntities.length; j++) {
        if(roll <= moon.daytimeEntities[0].roll) {
          dayList.push(moon.daytimeEntities[0].name);
          break;
        }
        else if(roll > moon.daytimeEntities[j - 1].roll && roll <= moon.daytimeEntities[j].roll) {
          dayList.push(moon.daytimeEntities[j].name);
          break;
        }
      }
    }

    //Night
    const maxSpawned = {};
    let currPower = 0;
    let currSpawned = 0;
    const spawned = [...nightSpawned];

    for(let i = 0; i < moon.nightEntities.length; i++) {
      maxSpawned[moon.nightEntities[i].name] = 0;
    }

    while(currPower < moon.outdoorPower) {
      const roll = Math.floor(Math.random() * 101);
      for(let i = 1; i < moon.nightEntities.length; i++) {
        if(roll <= moon.nightEntities[0].roll) {
          for(let j = 0; j < nightEntities.length; j++) {
            if(nightEntities[j].name === moon.nightEntities[0].name && maxSpawned[moon.nightEntities[0].name] < nightEntities[j].maxSpawned) {
              nightEntities[j].shown = false;
              nightList.push(nightEntities[j]);
              currPower += nightEntities[j].power;
              spawned.push(false);
            }
          }
          break;
        }
        else if(roll > moon.nightEntities[i - 1].roll && roll <= moon.nightEntities[i].roll) {
          for(let j = 0; j < nightEntities.length; j++) {
            if(nightEntities[j].name === moon.nightEntities[i].name && maxSpawned[moon.nightEntities[i].name] < nightEntities[j].maxSpawned) {
              nightEntities[j].shown = false;
              nightList.push(nightEntities[j]);
              currPower += nightEntities[j].power;
              spawned.push(false);
            }
          }
          break;
        }
      }

      currSpawned++;
    }

    setNightSpawned(spawned);
  }

  const populateMoon = (moon, index) => {
    const roomCount = mapSizes[index] + 1;
    const roomList = [
      {
        entity: {},
        landmine: false,
        roomNum: 0,
        roomType: 'Main Entrance',
        scraps: [],
        spikeTrap: false,
        turret: false,
        placed: false,
        connections: [],
        lightsOn: 5,
        lightsOff: 5
      }
    ];
    const maxScrap = Math.floor(Math.random() * (moon.maxScrap - moon.minScrap + 1) + moon.minScrap);
    const maxEntityPower = moon.indoorPower;
    const currentlyInsideSpawned = {};
    const currentlySpawnedRooms = {};
    const dayEntityList = [];
    const nightEntityList = [];

    let currTraps = [0, 0, 0];
    let currScrap = 0;
    let currEntityPower = 0;

    for(let i = 0; i < insideEntities.length; i++) {
      currentlyInsideSpawned[insideEntities[i].name] = 0;
    }

    for(let i = 0; i < rooms.length; i++) {
      currentlySpawnedRooms[rooms[i].name] = 0;
    }

    for(let i = 1; i < roomCount; i++) {
      determineTraps(currTraps, roomList, moon); //DONE
      currScrap = determineScrap(currScrap, maxScrap, roomList, moon, i); //DONE
      currEntityPower = determineInsideEntity(currEntityPower, maxEntityPower, roomList, moon, i, currentlyInsideSpawned); //DONE
      determineRoomType(roomList, currentlySpawnedRooms, i);
      const lightsOn = Math.floor(Math.random() * 5) + 3;
      let lightsOff = lightsOn - 4;
      if(lightsOff < 0) lightsOff = 0;
      roomList[i].lightsOn = lightsOn;
      roomList[i].lightsOff = lightsOff;
    }

    determineOutsideEntities(moon, dayEntityList, nightEntityList);

    if(weather[index] === 'Eclipsed') {
      const insideEclipsed = Math.floor(Math.random() * moon.insideEntities.length);
      for(let i = 0; i < insideEntities.length; i++) {
        if(moon.insideEntities[insideEclipsed].name === insideEntities[i].name) {
          roomList[roomList.length - 1].entity = insideEntities[i];
        }
      }
    }

    setRoomData(roomList);
    setChosenDayEntities(dayEntityList);
    setChosenNightEntities(nightEntityList);
  }

  const handleMoonChange = (moon) => {
    if(moon === currMoon) return;

    setPrevMoon(currMoon);
    setRoomData([]);
    setCurrMoon(moon);
    setTime({
      minute: 0,
      hour: 8
    });
    setEntityLocations([]);
    setMapGenerated(false);
    setGrid([]);
    setRound(0);
    setNightSpawned([]);
    setFloodLevel(0);
  }

  const handleDayChange = () => {
    if(day === -1) setDay(parseInt(day) + 2);
    else setDay(parseInt(day) + 1);

    setRoomData([]);
    setTime({
      minute: 0,
      hour: 8
    });
    setEntityLocations([]);
    setMapGenerated(false);
    setGrid([]);
    setRound(0);
    setNightSpawned([]);
    setWeather([]);
    setPrevMoon(currMoon);
    setFloodLevel(0);
  }

  const handleRoundChange = (index) => {
    let currMin = time.minute;
    let currHour = time.hour;

    if(currMin + 15 >= 60) {
      currMin = 0;

      if(currHour + 1 > 24) {
        currHour = 1;
      }
      else {
        currHour++;
      }
    }
    else {
      currMin += 15;
    }

    setTime({
      minute: currMin,
      hour: currHour
    });

    //Flooded
    setFloodLevel(currHour - 8);

    //Entities
    const currRound = round + 1;

    for(let i = 0; i < entityLocations.length - 4; i++) {
      if(entityLocations[i].spawned) {
        if(currRound % entityLocations[i].moves === 0) {
          for(let j = 0; j < roomData.length; j++) {
            if(roomData[j].roomNum === entityLocations[i].roomNum) {
              const direction = Math.floor(Math.random() * roomData[j].connections.length);
              entityLocations[i].roomNum = roomData[j].connections[direction];
              break;
            }
          }
        }
      }
    }

    if(currRound % 3 === 0) {
      let spawnCount = 0;
      for(let i = 0; i < entityLocations.length - 4; i++) {
        if(entityLocations[i].spawned) spawnCount++;
      }

      if(spawnCount < entityLocations.length - 4) {
        let spawnTarget = Math.floor(Math.random() * entityLocations.length);
        while(entityLocations[spawnTarget].spawned) {
          spawnTarget = Math.floor(Math.random() * entityLocations.length);
        }

        entityLocations[spawnTarget].spawned = true;
      }
    }

    setRound(currRound);

    let moon = {};
    for(let i = 0; i < moons.length; i++) {
      if(moons[i].name === currMoon) {
        moon = moons[i];
      }
    }

    let showCount = 0;

    for(let i = 0; i < nightSpawned.length; i++) {
      if(nightSpawned[i]) showCount++;
    }

    console.log(nightSpawned);

    if(showCount < nightSpawned.length) {
      if(weather[index] === 'Eclipsed' && currMin === 0) {
        let spawn = Math.floor(Math.random() * nightSpawned.length);
        while(nightSpawned[spawn]) {
          spawn = Math.floor(Math.random() * nightSpawned.length);
        }
        nightSpawned[spawn] = true;
      }
      else {
        if(currHour >= moon.nightTime && currHour < 18 && currMin === 0) {
          let spawn = Math.floor(Math.random() * nightSpawned.length);
          while(nightSpawned[spawn]) {
            spawn = Math.floor(Math.random() * nightSpawned.length);
          }
  
          const chance = Math.floor(Math.random() * 4);
          if(chance === 2) {
            nightSpawned[spawn] = true;
          }
        }
        else if(currHour >= 18 && currMin === 0) {
          let spawn = Math.floor(Math.random() * nightSpawned.length);
          while(nightSpawned[spawn]) {
            spawn = Math.floor(Math.random() * nightSpawned.length);
          }
          nightSpawned[spawn] = true;
        }
      }
    }
  }

  const generateEntityLocations = () => {
    const temp = [];

    for(let i = 0; i < roomData.length; i++) {
      if(Object.keys(roomData[i].entity).length > 0) {
        temp.push({
          name: roomData[i].entity.name,
          spawned: roomData[i].entity.spawned,
          moves: roomData[i].entity.moves,
          roomNum: roomData[i].roomNum,
          player: false
        });
      }
    }

    for(let i = 0; i < 4; i++) {
      temp.push({
        name: "Player " + (i + 1),
        roomNum: 0,
        player: true
      })
    }

    setEntityLocations(temp);
  }

  const createMap = (remainingTiles, row, col, cameFrom) => {
    if(remainingTiles < 0) {
      return;
    }
  
    //Place Tile
    let mapPiece = Math.floor(Math.random() * roomData.length);
    while(roomData[mapPiece].placed === true) {
      mapPiece = Math.floor(Math.random() * roomData.length);
    }
  
    //Down is 0[2], Left is 1[3], Up is 2[0], Right is 3[1]. So, move the opposite of cameFrom.
    const previous = [row, col];
    if(cameFrom === 0) {
      if(row - 1 < 0) row = 8;
      else row--;
    }
    if(cameFrom === 1) {
      if(col + 1 > 8) col = 0;
      else col++;
    }
    if(cameFrom === 2) {
      if(row + 1 > 8) row = 0;
      else row++;
    }
    if(cameFrom === 3) {
      if(col - 1 < 0) col = 8;
      else col--;
    }
  
    if(grid[row][col] > -1) {
      const shouldConnect = Math.floor(Math.random() * 4);
      if(shouldConnect === 1) {
        let curr, prev;
        for(let i = 0; i < roomData.length; i++) {
          if(roomData[i].roomNum === grid[row][col]) {
            //This is the current room. Not the one selected earlier in the function.
            curr = roomData[i];
          }
  
          if(roomData[i].roomNum === grid[previous[0]][previous[1]]) {
            prev = roomData[i];
          }
        }
  
        let alreadyConnected = false;
        for(let i = 0; i < curr.connections.length; i++) {
          if(curr.connections[i] === prev.roomNum) {
            alreadyConnected = true;
          }
        }
  
        if(!alreadyConnected) {
          curr.connections.push(prev.roomNum);
          prev.connections.push(curr.roomNum);
        }
      }
      createMap(remainingTiles, row, col, cameFrom);
    }
    else {
      roomData[mapPiece].placed = true;
      grid[row][col] = roomData[mapPiece].roomNum;
      roomData[mapPiece].connections.push(grid[previous[0]][previous[1]]);
      //Add to the previous the current connection.
      for(let i = 0; i < roomData.length; i++) {
        if(grid[previous[0]][previous[1]] === roomData[i].roomNum) {
          roomData[i].connections.push(roomData[mapPiece].roomNum);
        }
      }
  
      let i = (cameFrom + 1) % 4;
  
      if(remainingTiles === 2) {
        const p1Size = Math.floor(Math.random() * remainingTiles);
        const p2Size = Math.round(remainingTiles - p1Size);
  
        let out = Math.floor(Math.random() * 3);
        if(out === 0) {
          createMap(p1Size - 1, row, col, (i + 3) % 4);
          createMap(p2Size - 1, row, col, (i + 4) % 4);
        }
        else if(out === 1) {
          createMap(p1Size - 1, row, col, (i + 2) % 4);
          createMap(p2Size - 1, row, col, (i + 4) % 4);
        }
        else {
          createMap(p1Size - 1, row, col, (i + 3) % 4);
          createMap(p2Size - 1, row, col, (i + 2) % 4);
        }
      }
      else if(remainingTiles === 1) {
        let chosen = Math.floor(Math.random() * 3);
        if(chosen === 0) {
          createMap(remainingTiles - 1, row, col, (i + 2) % 4);
        }
        else if(chosen === 1) {
          createMap(remainingTiles - 1, row, col, (i + 3) % 4);
        }
        else {
          createMap(remainingTiles - 1, row, col, (i + 4) % 4);
        }
      }
      else {
        const p1Size = Math.floor(Math.random() * remainingTiles);
        const p2Size = Math.floor(Math.random() * (remainingTiles - p1Size));
        const p3Size = Math.round(remainingTiles - p1Size - p2Size);
  
        let direction = Math.floor(Math.random() * 3);
        if(direction === 0) {
          createMap(p1Size - 1, row, col, (i + 2) % 4);
          direction = Math.floor(Math.random() * 2);
          if(direction === 0) {
            createMap(p2Size - 1, row, col, (i + 3) % 4);
            createMap(p3Size - 1, row, col, (i + 4) % 4);
          }
          else {
            createMap(p3Size - 1, row, col, (i + 4) % 4);
            createMap(p2Size - 1, row, col, (i + 3) % 4);
          }
        }
        else if(direction === 1) {
          createMap(p2Size - 1, row, col, (i + 3) % 4);
          direction = Math.floor(Math.random() * 2);
          if(direction === 0) {
            createMap(p1Size - 1, row, col, (i + 2) % 4);
            createMap(p3Size - 1, row, col, (i + 4) % 4);
          }
          else {
            createMap(p3Size - 1, row, col, (i + 4) % 4);
            createMap(p1Size - 1, row, col, (i + 2) % 4);
          }
        }
        else {
          createMap(p3Size - 1, row, col, (i + 4) % 4);
          direction = Math.floor(Math.random() * 2);
          if(direction === 0) {
            createMap(p1Size - 1, row, col, (i + 2) % 4);
            createMap(p2Size - 1, row, col, (i + 3) % 4);
          }
          else {
            createMap(p2Size - 1, row, col, (i + 3) % 4);
            createMap(p1Size - 1, row, col, (i + 2) % 4);
          }
        }
      }
    }
  }

  const finishMap = (moon, index) => {
    if(mapGenerated || grid[4][4] === 0) return;

    grid[4][4] = 0;

    for(let i = 0; i < moons.size; i++) {

    }

    const mapSize = mapSizes[index];

    const p1Size = Math.floor(Math.random() * mapSize);
    const p2Size = Math.floor(Math.random() * (mapSize - p1Size));
    const p3Size = Math.round(mapSize - p1Size - p2Size);

    createMap(p1Size - 1, 4, 4, 3);
    createMap(p2Size - 1, 4, 4, 0);
    createMap(p3Size - 1, 4, 4, 1);

    setMapGenerated(true);

    const possibleRooms = [];
    for(let i = 0; i < roomData.length; i++) {
      if(roomData[i].connections.length < 4) {
        possibleRooms.push(roomData[i].roomNum);
      }
    }

    if(moon.name === 'March') {
      for(let i = 0; i < 3; i++) {
        let fireExit = Math.floor(Math.random() * possibleRooms.length);
        while(roomData[possibleRooms[fireExit]].fireExit) {
          fireExit = Math.floor(Math.random() * possibleRooms.length);
        }
        roomData[possibleRooms[fireExit]].fireExit = true;
      }
    }
    else {
      const fireExit = Math.floor(Math.random() * possibleRooms.length);
      roomData[possibleRooms[fireExit]].fireExit = true;
    }
  }

  const populateGrid = () => {
    const tempGrid = [];
    for(let i = 0; i < 9; i++) {
      const tempArr = [];
      for(let j = 0; j < 9; j++) {
        tempArr.push(-1);
      }
      tempGrid.push(tempArr);
    }

    const temp = [...roomData];
    temp[0].placed = true;
    setRoomData(temp);
    setGrid(tempGrid);
  }

  const DisplayOutsideEntities = () => {
    let entities = [];
    if(chosenDayEntities.length === 0) {
      entities = [...chosenNightEntities];
    }
    else {
      entities = [...chosenDayEntities, ...chosenNightEntities];
    }

    return (
      <Box>
        <Stack direction='row' gap={1} flexWrap='wrap'>
          {entities.map((data, index) => {
            return (
              <Box>
                {data.soak !== undefined ? 
                  <Card sx={{width: {xs: '25%', md: '100px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '120px'}}>
                    <NightEntity data={data}/>
                    {chosenDayEntities.length === 0 ?
                      nightSpawned[index] ? <Checkbox checked disabled></Checkbox> : <Checkbox disabled></Checkbox>
                    :
                      nightSpawned[index - 4] ? <Checkbox checked disabled></Checkbox> : <Checkbox disabled></Checkbox>
                    }
                  </Card>
                : 
                  <Card sx={{width: {xs: '25%', md: '100px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '120px'}}>
                    <Typography textAlign='center' sx={{fontWeight: 'bold'}}>{data}</Typography>
                    <Checkbox checked disabled />
                  </Card>
                }
              </Box>
            )
          })}
        </Stack>
      </Box>
    )
  }

  const DisplayFloodLevel = () => {
    if(floodLevel >= 10 && floodLevel < 15) {
      return <Typography>Flood Level {floodLevel}/16. Difficulty {floodLevel - 9} to traverse.</Typography>
    }
    else if(floodLevel === 15 || floodLevel === 16) {
      return <Typography>Flood Level {floodLevel}/16. Impossible to traverse.</Typography>
    }
    else {
      return <Typography>Flood Level {floodLevel}/16.</Typography>
    }
  }

  const DisplayFogLevel = () => {
    if(time.hour >= 8 && time.hour <= 12) {
      const fogLevel = Math.floor(Math.random() * 3);
      return <Typography>Fog Level: {fogLevel}</Typography>
    }
    else if(time.hour > 12 && time.hour <= 16) {
      const fogLevel = Math.floor(Math.random() * 3) + 1;
      return <Typography>Fog Level: {fogLevel}</Typography>
    }
    else if(time.hour > 16 && time.hour <= 20) {
      const fogLevel = Math.floor(Math.random() * 3) + 2;
      return <Typography>Fog Level: {fogLevel}</Typography>
    }
    else {
      const fogLevel = Math.floor(Math.random() * 3) + 3;
      return <Typography>Fog Level: {fogLevel}</Typography>
    }
  }

  const Moon = () => {
    return (
      <Box display='flex'>
        {weather.length === 0 ? getWeather() : ""}

        <Drawer open={moonList} onClick={() => setMoonList(false)} anchor="top" sx={{width: {xs: '20%', md: '12%'}}}>
          <Box>
            <Button variant="contained" onClick={handleDayChange}>Advance Day</Button>
            <Divider />
            <Stack direction='row' flexWrap='wrap' spacing={2}>
              {moons.map((moon, index) => (
                <Button onClick={() => handleMoonChange(moon.name, "n")} sx={{color: 'black'}}>{moon.name + " (" + weather[index] + ") [" + moon.cost + "]"}</Button>
              ))}
            </Stack>
          </Box>
        </Drawer>

        <Box sx={{ flexGrow: 1, p: 3 }}>
          {moons.map((moon, index) => {
            return (
              moon.name === currMoon ?
                <Box>
                  <Button variant="contained" onClick={() => setMoonList(true)}>Show moons</Button>
                  {shop.length === 0 ? getShopData() : <DisplayShop />}
                  <Typography variant="h2">{moon.name} ({weather[index]})</Typography>
                  {time.hour ? 
                    <Typography variant="h5">Current time: {time.hour > 12 ? time.hour - 12 : time.hour}:{time.minute === 0 ? "00" : time.minute} {time.hour >= 12 && time.hour < 24 ? "PM" : "AM"}</Typography>
                  :
                    ""
                  }
                  {day % 3 === 0 ? <Typography variant="h5">Day: {day} (Quota Deadline)</Typography> : <Typography variant="h5">Day: {day < 0 ? 0 : day}</Typography>}
                  <Typography>Current Quota: {day < 0 ? quotas[0] : quotas[Math.floor((day - 1) / 3)]}</Typography>
                  {weather[index] === 'Flooded' ? <DisplayFloodLevel /> : ""}
                  {weather[index] === 'Foggy' ? <DisplayFogLevel /> : ""}
                  <Button variant="contained" onClick={() => handleRoundChange(index)}>Advance Round</Button>
                  
                  {insideEntities.length === 0 ? 
                    <>
                      {getData('Rooms')}
                      {getData('InsideEntities')}
                      {getData('Scraps')}
                      {getData('NightEntities')}
                    </>
                  :
                    <>
                      {roomData.length === 0 ?
                        <Box>
                          {populateMoon(moon, index)}
                        </Box>
                      :
                        <Box>
                          {grid.length === 0 ? populateGrid() : ""}
                          <Stack>
                            <Box overflow='auto'>
                              {entityLocations.length === 0 ? generateEntityLocations() :
                                <Box>
                                  <Typography variant="h5" textAlign='center'>Entity Locations</Typography>
                                  <Divider />
                                  <br />
                                  <Stack direction='row' gap={1} flexWrap='wrap'>
                                    {entityLocations.map((loc) => {
                                      return (
                                        <Box>
                                          {loc.player ? 
                                            ""
                                          :
                                            <Box>
                                              <Card sx={{width: {xs: '25%', md: '100px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '120px'}}>
                                                <Typography textAlign='center' sx={{fontWeight: 'bold'}}>{loc.name}</Typography>
                                                <Typography textAlign='center'>Room: <b>{loc.roomNum}</b></Typography>
                                                {loc.spawned ? <Checkbox checked disabled></Checkbox> : <Checkbox disabled></Checkbox>}
                                              </Card>
                                            </Box>
                                          }
                                        </Box>
                                      )
                                    })}
                                  </Stack>
                                </Box>
                              }
                            </Box>
                            <Box overflow='auto'>
                              <Typography variant="h5" textAlign='center'>Outside Entities</Typography>
                              <Divider />
                              <br />
                              <DisplayOutsideEntities />
                            </Box>
                          </Stack>
                          <br />
                          {mapGenerated ? <DisplayMap /> : grid.length !== 0 ? finishMap(moon, index) : ""}
                          <Stack direction='row' flexWrap='wrap' gap={1}>
                            {roomData.map((data) => {
                              return <Room data={data}/>
                            })}
                          </Stack>
                        </Box>
                      }
                    </>
                  }
                </Box>
              :
                ""
            )
          })}
        </Box>
      </Box>
    )
  }

  const DisplayShop = () => {
    const variables = [];
    const staticItems = [];

    for(let i = 0; i < shop.length; i++) {
      if(shop[i].type === 'variable') {
        variables.push(shop[i]);
      }
      else {
        staticItems.push(shop[i]);
      }
    }

    if((day - 1) % 3 !== 0) {
      return <Shop static={staticItems} variable={variables}/>
    }

    if(prevMoon !== currMoon) {
      return <Shop static={staticItems} variable={variables}/>
    }

    for(let i = 0; i < shop.length; i++) {
      shop[i].shown = false;
    }

    for(let i = 0; i < 4; i++) {
      let chosenItem = Math.floor(Math.random() * variables.length);
      while(variables[chosenItem].shown) {
        chosenItem = Math.floor(Math.random() * variables.length);
      }
      variables[chosenItem].shown = true;
    }

    return <Shop static={staticItems} variable={variables}/>
  }

  const DisplayMap = () => {
    return (
      <Box maxWidth='750px'>
        <Table sx={{border: '1px solid black'}}>
          <TableBody>
            {grid.map((piece) => {
              return (
                <TableRow>
                  {piece.map((p) => {
                    return (
                      p === -1 ? 
                        <TableCell sx={{background: 'black', color: 'black', border: '1px solid white', width: '25px', height: '25px'}}></TableCell> 
                      :
                        p === 0 ?
                          <TableCell sx={{background: 'green', color: 'white', border: '1px solid black', width: '25px', height: '25px'}}>{p}</TableCell>
                        :
                          <TableCell sx={{background: 'white', color: 'black', border: '1px solid black', width: '25px', height: '25px'}}>{p}</TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Box>
    )
  }

  const updateLocalStorage = () => {
    if(roomData.length === 0 || grid.length === 0) return;

    localStorage.setItem("currMoon", currMoon);
    localStorage.setItem("prevMoon", prevMoon);
    localStorage.setItem("weather", JSON.stringify(weather));
    localStorage.setItem("roomData", JSON.stringify(roomData));
    localStorage.setItem("chosenNightEntities", JSON.stringify(chosenNightEntities));
    localStorage.setItem("chosenDayEntities", JSON.stringify(chosenDayEntities));
    localStorage.setItem("grid", JSON.stringify(grid));
    localStorage.setItem("time", JSON.stringify(time));
    localStorage.setItem("day", day);
    localStorage.setItem("round", round);
    localStorage.setItem("entityLocations", JSON.stringify(entityLocations));
    localStorage.setItem("shop", JSON.stringify(shop));
    localStorage.setItem("mapGenerated", mapGenerated);
    localStorage.setItem("nightSpawned", JSON.stringify(nightSpawned));
  }

  const retrieveLocalStorage = () => {
    if(dataRetrieved) return;

    if(localStorage.getItem("currMoon") !== null && currMoon === "") setCurrMoon(localStorage.getItem("currMoon"));
    if(localStorage.getItem("prevMoon") !== null && prevMoon === "") setPrevMoon(localStorage.getItem("prevMoon"));
    if(localStorage.getItem("day") !== null && day === -1) setDay(localStorage.getItem("day"));
    if(localStorage.getItem("round") !== null && round === -1) setRound(localStorage.getItem("round"));
    if(JSON.parse(localStorage.getItem("grid")) !== null && grid.length === 0) {
      setGrid(JSON.parse(localStorage.getItem("grid")));
      setMapGenerated(localStorage.getItem("mapGenerated"));
    }
    if(JSON.parse(localStorage.getItem("entityLocations")) !== null && entityLocations.length === 0) setEntityLocations(JSON.parse(localStorage.getItem("entityLocations")));
    if(JSON.parse(localStorage.getItem("shop")) !== null && shop.length === 0) setShop(JSON.parse(localStorage.getItem("shop")));
    if(JSON.parse(localStorage.getItem("nightSpawned")) !== null && nightSpawned.length === 0) setNightSpawned(JSON.parse(localStorage.getItem("nightSpawned")));
    if(JSON.parse(localStorage.getItem("time")) !== null && Object.keys(time).length === 0) setTime(JSON.parse(localStorage.getItem("time")));
    if(JSON.parse(localStorage.getItem("weather")) !== null && weather.length === 0) setWeather(JSON.parse(localStorage.getItem("weather")));
    if(JSON.parse(localStorage.getItem("roomData")) !== null && roomData.length === 0) setRoomData(JSON.parse(localStorage.getItem("roomData")));
    if(JSON.parse(localStorage.getItem("chosenDayEntities")) !== null && chosenDayEntities.length === 0) setChosenDayEntities(JSON.parse(localStorage.getItem("chosenDayEntities")));
    if(JSON.parse(localStorage.getItem("chosenNightEntities")) !== null && chosenNightEntities.length === 0) setChosenNightEntities(JSON.parse(localStorage.getItem("chosenNightEntities")));

    if(dataRetrieved === false) setDataRetrieved(true);
  }

  return (
    <Box>
      {moons.length === 0 ? 
        getData('Moons')
      :
        <>
          {retrieveLocalStorage()}
          <Moon />
        </>
      }
      {updateLocalStorage()}
    </Box>
  )
}