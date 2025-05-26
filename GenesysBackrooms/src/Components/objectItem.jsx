import { Box, Button, Card, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Divider, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography, IconButton, Paper, Fade, useTheme, useMediaQuery } from "@mui/material";
import { Close as CloseIcon, Visibility, VisibilityOff, TableChart } from "@mui/icons-material";
import { doc, updateDoc } from "firebase/firestore";
import db from '../Components/firebase';
import { useState } from "react";

export default function ObjectItem(props) {
  const [tableShown, setTableShown] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const changeVisibility = () => {
    updateDoc(doc(db, 'Objects', props.currObject.name), {
      shownToPlayer: !props.currObject.shownToPlayer
    })
  }

  const getRarityColor = (rarity) => {
    if(rarity < 2) {
      return 'default';
    }
    if(rarity < 4) {
      return 'primary';
    }
    if(rarity < 6) {
      return 'secondary';
    }
    if(rarity < 8) {
      return 'warning';
    }
    return 'error';
  };

  const ShowTable = () => {
    if(props.currObject.table === 'No') return null;

    const tableData = JSON.parse(props.currObject.table);
    const keys = Object.keys(tableData);
    let innerKeys = Object.keys(tableData[keys[0]]);

    return (
      <Dialog open={tableShown} onClose={() => setTableShown(false)} maxWidth="md" fullWidth fullScreen={isMobile} TransitionComponent={Fade} PaperProps={{ sx: { borderRadius: isMobile ? 0 : 2, maxHeight: '90vh' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', py: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>{props.currObject.name} - Data Table</Typography>
          <IconButton onClick={() => setTableShown(false)} sx={{ color: 'white' }} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ overflow: 'auto', maxHeight: '70vh' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>Name</TableCell>
                  {props.currObject.name === 'Tarot Deck' ?
                    <TableCell sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>Effect</TableCell>
                  :
                    innerKeys.map((key, index) => (
                      <TableCell key={index} sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>{key}</TableCell>
                    ))
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {props.currObject.name === 'Tarot Deck' ?
                  Object.keys(tableData).map((_, index) => (
                    <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' } }}>
                      <TableCell sx={{ fontWeight: 500 }}>{keys[index]}</TableCell>
                      <TableCell>{tableData[keys[index]]}</TableCell>
                    </TableRow>
                  ))
                :
                  keys.map((key, index) => (
                    <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' } }}>
                      <TableCell sx={{ fontWeight: 500 }}>{key}</TableCell>
                      {Object.keys(tableData[keys[index]]).map((k, index2) => (
                        <TableCell key={index2}>{tableData[keys[index]][Object.keys(tableData[keys[index]])[index2]]}</TableCell>
                      ))}
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
          <Button onClick={() => setTableShown(false)} variant="contained" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', '&:hover': { background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)' } }}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }

  const isAdmin = localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN';
  const isVisible = props.currObject.shownToPlayer;

  return (
    <Card elevation={3} sx={{ width: { xs: '100%', sm: '380px', md: '400px' }, height: '500px', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 3, overflow: 'hidden', transition: 'all 0.3s ease-in-out', position: 'relative', display: 'flex', flexDirection: 'column', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.15)' } }}>
      <Box sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', p: 2.5, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.3)', mb: 1 }}>{props.currObject.name}</Typography>
        {/* Status Indicator */}
        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: isVisible ? '#4caf50' : '#f44336', boxShadow: '0 0 0 2px rgba(255,255,255,0.3)' }} />
        </Box>
      </Box>
      {/* Content Section */}
      <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Chips Section */}
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2.5 }} justifyContent="center">
          <Chip label={"Rarity: " + props.currObject.rarity} size="small" color={getRarityColor(props.currObject.rarity)} sx={{ fontWeight: 500 }} />
          <Chip label={`Price: ${props.currObject.price}`} size="small" color="success" variant="outlined" sx={{ fontWeight: 500 }} />
          <Chip label={`Encumbrance: ${props.currObject.encumbrance}`} size="small" color="warning" variant="outlined" sx={{ fontWeight: 500 }} />
        </Stack>
        <Divider sx={{ my: 2, backgroundColor: 'rgba(0,0,0,0.12)' }} />
        {/* Description */}
        <Paper elevation={0} sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 2, flex: 1, overflow: 'auto' }}>
          <Typography variant="body2" sx={{ textAlign: 'justify', lineHeight: 1.6, color: 'text.primary' }}>{props.currObject.description}</Typography>
        </Paper>
      </Box>
      <Box sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.9)', borderTop: '1px solid rgba(0,0,0,0.08)', flexShrink: 0 }}>
        <Stack direction={isMobile ? 'column' : 'row'} spacing={1} justifyContent="center">
          {props.currObject.table !== 'No' && (
            <Button size="small" onClick={() => setTableShown(true)} variant="outlined" startIcon={<TableChart />} sx={{ borderColor: '#667eea', color: '#667eea', '&:hover': { backgroundColor: '#667eea', color: 'white' } }}>View Table</Button>
          )}
          {isAdmin && (
            <Button
              size="small"
              onClick={changeVisibility}
              variant="contained"
              startIcon={isVisible ? <VisibilityOff /> : <Visibility />}
              sx={{ background: isVisible ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', '&:hover': { background: isVisible ? 'linear-gradient(135deg, #e081e9 0%, #e3455a 100%)' : 'linear-gradient(135deg, #3d8bfe 0%, #00d9fe 100%)' } }}>
              {isVisible ? 'Hide' : 'Show'} Object
            </Button>
          )}
        </Stack>
      </Box>
      <ShowTable />
    </Card>
  )
}