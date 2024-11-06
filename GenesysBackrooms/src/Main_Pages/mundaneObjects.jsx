import { Box, Button, Toolbar } from "@mui/material"
import { doc, setDoc } from "firebase/firestore"
import db from '../Components/firebase';

export default function MundaneObjects() {
  const data = {
    "AA Battery": {name: "AA Battery", description: "A cylindrical object about the size of a pinky finger with a small silver bump in the center of one of the long sides. It says 'AA' with a + on one side and a - on another.", usedBy: []},
    "AAA Battery": {name: "AAA Battery", description: "A cylindrical object about the size of a pinky finger with a small silver bump in the center of one of the long sides. It says 'AAA' with a + on one side and a - on another.", usedBy: []},
    "C Battery": {name: "C Battery", description: "A cylindrical object about the size of a pinky finger but thicker than a thumb with a small silver bump in the center of one of the long sides. It says 'C' with a + on one side and a - on another.", usedBy: []},
    "D Battery": {name: "D Battery", description: "A cylindrical object about the size of a pinky finger but thicker than a thumb with a small silver bump in the center of one of the long sides. It says 'D' with a + on one side and a - on another.", usedBy: []},
    "Specialty Fuel": {name: "Specialty Fuel", description: "A dark viscous liquid. It smells heavily of gasoline.", usedBy: ["Hyrum lanterns", "Deuclidators"]},
    "Dumb Gum": {name: "Dumb Gum", description: "A hot pink piece of taffy-like gum. The surface is reflective, like glass.", usedBy: []},
    "Specialty Beaker": {name: "Specialty Beaker", description: "A gray-tinted beaker with no markings on the sides.", usedBy: ["Liquid Silence", "Liquid Pain"]},

    //"": {name: "", description: "", usedBy: []}
  }

  const addData = () => {
    for(let i = 0; i < Object.keys(data).length; i++) {
      setDoc(doc(db, 'MundaneObjects', Object.keys(data)[i]), {
        name: data[Object.keys(data)[i]].name,
        description: data[Object.keys(data)[i]].description,
        usedBy: data[Object.keys(data)[i]].usedBy
      })
    }
  }

  return (
    <Box>
      <Toolbar />
      <Button onClick={addData}>Add</Button>
    </Box>
  )
}

//All mundane objects buy at 10 for 1 almond water. They do not have sell value.
//All mundane objects can be found on every level.