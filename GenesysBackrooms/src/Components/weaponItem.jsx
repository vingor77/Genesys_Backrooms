import { Box, Button, Card, Chip, Dialog,Typography, CardContent,CardHeader,Stack,Paper,Fade,Avatar,Grid,IconButton,Divider } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import db from '../Components/firebase';
import { AttachMoney,Build,Security,FitnessCenter,AutoAwesome,Visibility,VisibilityOff,Close,StarRate,Gavel,MyLocation,FlashOn,TouchApp } from '@mui/icons-material';

export default function WeaponItem(props) {
  const [anomalousDisplayed, setAnomalousDisplayed] = useState(false);
  const specials = props.currWeapon.specials ? props.currWeapon.specials.split("/").filter(Boolean) : [];

  // Get rarity color and gradient (same as armor)
  const getRarityInfo = (rarity) => {
    const rarityMap = {
      'Common': { 
        color: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
        chipColor: 'default'
      },
      'Uncommon': { 
        color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        chipColor: 'success'
      },
      'Rare': { 
        color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        chipColor: 'primary'
      },
      'Epic': { 
        color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        chipColor: 'secondary'
      },
      'Legendary': { 
        color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        chipColor: 'warning'
      },
      'Artifact': { 
        color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        chipColor: 'error'
      }
    };
    return rarityMap[rarity] || rarityMap['Common'];
  };

  // Get weapon type icon based on skill
  const getWeaponIcon = (skill) => {
    const iconMap = {
      'Melee': '⚔️',
      'Ranged': '🏹',
      'Gunnery': '🏹',
      'Heavy': '🔨',
      'Light': '🗡️',
      'Firearms': '🔫',
      'Thrown': '🪃'
    };
    return iconMap[skill] || '⚔️';
  };

  const rarityInfo = getRarityInfo(props.currWeapon.rarity);
  const isAdmin = localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN';
  const isHidden = props.currWeapon.hidden === 'Yes';
  const hasAnomalousEffect = props.currWeapon.anomalousEffect !== "None";
  const isMelee = props.currWeapon.skill === 'Melee';

  const StatRow = ({ icon, label, value, highlight = false }) => (
    <Box 
      display="flex" 
      alignItems="center" 
      justifyContent="space-between"
      sx={{ 
        py: 0.5,
        px: 1,
        borderRadius: 1,
        bgcolor: highlight ? 'rgba(255,255,255,0.1)' : 'transparent'
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        {icon}
        <Typography variant="body2" color="rgba(255,255,255,0.9)">
          {label}:
        </Typography>
      </Box>
      <Typography 
        variant="body2" 
        fontWeight={highlight ? "bold" : "normal"}
        color="white"
      >
        {value}
      </Typography>
    </Box>
  );

  const flipHidden = () => {
    updateDoc(doc(db, 'Weapons', props.currWeapon.name), {
      hidden: props.currWeapon.hidden === 'Yes' ? 'No' : 'Yes'
    })
  }

  return (
    <>
      <Fade in timeout={500}>
        <Card 
          elevation={8}
          sx={{
            width: { xs: '100%', md: '420px' },
            height: '400px',
            borderRadius: 4,
            background: rarityInfo.color,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              transform: 'translateY(-4px)',
              transition: 'transform 0.3s ease',
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
            }
          }}
        >
          {/* Header */}
          <CardHeader
            avatar={
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  fontSize: '1.5rem'
                }}
              >
                {getWeaponIcon(props.currWeapon.skill)}
              </Avatar>
            }
            title={
              <Typography variant="h5" fontWeight="bold" color="white">
                {props.currWeapon.name}
              </Typography>
            }
            subheader={
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5} sx={{ mt: 1 }}>
                <Chip
                  icon={<StarRate />}
                  label={props.currWeapon.rarity}
                  size="small"
                  color={rarityInfo.chipColor}
                  sx={{ fontWeight: 'bold' }}
                />
                <Chip
                  icon={<TouchApp />}
                  label={props.currWeapon.skill}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white'
                  }}
                />
                <Chip
                  icon={<AttachMoney />}
                  label={props.currWeapon.price}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white'
                  }}
                />
                {hasAnomalousEffect && (
                  <Chip
                    icon={<AutoAwesome />}
                    label="Anomalous"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255, 215, 0, 0.3)',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                )}
                {isHidden && isAdmin && (
                  <Chip
                    icon={<VisibilityOff />}
                    label="Hidden"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(244, 67, 54, 0.3)',
                      color: 'white'
                    }}
                  />
                )}
              </Stack>
            }
            sx={{ pb: 1 }}
          />

          {/* Content */}
          <CardContent sx={{ 
            height: 'calc(100% - 140px)', 
            overflow: 'auto',
            p: 2,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255,255,255,0.3)',
              borderRadius: '3px',
            }
          }}>
            
            {/* Description */}
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                mb: 2, 
                borderRadius: 2,
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography 
                variant="body2" 
                color="rgba(255,255,255,0.9)"
                sx={{ lineHeight: 1.6, fontStyle: 'italic' }}
              >
                {props.currWeapon.description}
              </Typography>
            </Paper>

            {/* Stats */}
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                borderRadius: 2,
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="white" sx={{ mb: 1 }}>
                Weapon Statistics
              </Typography>
              
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <StatRow 
                    icon={<Build fontSize="small" />}
                    label="Skill"
                    value={props.currWeapon.repairSkill}
                  />
                  <StatRow 
                    icon={<Security fontSize="small" />}
                    label="Durability"
                    value={props.currWeapon.durability}
                  />
                  <StatRow 
                    icon={<Gavel fontSize="small" />}
                    label="Damage"
                    value={`${isMelee ? '+' : ''}${props.currWeapon.damage}`}
                    highlight
                  />
                  <StatRow 
                    icon={<FlashOn fontSize="small" />}
                    label="Critical"
                    value={props.currWeapon.crit}
                    highlight
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatRow 
                    icon={<MyLocation fontSize="small" />}
                    label="Range"
                    value={props.currWeapon.range}
                  />
                  <StatRow 
                    icon={<FitnessCenter fontSize="small" />}
                    label="Encumbrance"
                    value={props.currWeapon.encumbrance}
                  />
                </Grid>
              </Grid>

              {/* Specials */}
              {specials.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="white" sx={{ mb: 1 }}>
                    Special Properties:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {specials.map((special, index) => (
                      <Chip
                        key={index}
                        label={special}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: 'white'
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Set Bonus */}
              {props.currWeapon.setBonus && props.currWeapon.setBonus !== "None" && (
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', mb: 1 }} />
                  <Typography variant="subtitle2" fontWeight="bold" color="white">
                    Part of Set: {props.currWeapon.setBonus}
                  </Typography>
                </Box>
              )}
            </Paper>
          </CardContent>

          {/* Action Buttons */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              right: 12,
              display: 'flex',
              gap: 1,
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            {hasAnomalousEffect && (
              <Button
                onClick={() => setAnomalousDisplayed(true)}
                variant="contained"
                size="small"
                startIcon={<AutoAwesome />}
                sx={{
                  bgcolor: 'rgba(255,215,0,0.3)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    bgcolor: 'rgba(255,215,0,0.5)'
                  },
                  borderRadius: 3,
                  fontSize: '0.75rem'
                }}
              >
                Anomalous Effect
              </Button>
            )}
            
            {isAdmin && (
              <Button
                onClick={flipHidden}
                variant="contained"
                size="small"
                startIcon={isHidden ? <Visibility /> : <VisibilityOff />}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)'
                  },
                  borderRadius: 3,
                  fontSize: '0.75rem'
                }}
              >
                {isHidden ? 'Show' : 'Hide'} Weapon
              </Button>
            )}
          </Box>
        </Card>
      </Fade>

      {/* Enhanced Anomalous Effect Dialog */}
      <Dialog 
        open={anomalousDisplayed} 
        onClose={() => setAnomalousDisplayed(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: rarityInfo.color,
            color: 'white'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <AutoAwesome />
            <Typography variant="h5" fontWeight="bold">
              {props.currWeapon.name} - Anomalous Effect
            </Typography>
          </Box>
          <IconButton
            onClick={() => setAnomalousDisplayed(false)}
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ p: 3 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Typography 
              variant="body1" 
              color="white"
              sx={{ lineHeight: 1.8 }}
            >
              {props.currWeapon.anomalousEffect}
            </Typography>
          </Paper>
        </Box>
      </Dialog>
    </>
  )
}