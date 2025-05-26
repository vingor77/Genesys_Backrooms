import { Card, CardContent, Chip, Typography, Box, Grid, Divider,Stack,useTheme,useMediaQuery } from "@mui/material";
import {Person as PersonIcon, Psychology as BrainIcon, DirectionsRun as AgilityIcon, Visibility as CunningIcon,Favorite as WillpowerIcon,RecordVoiceOver as PresenceIcon, Shield as DefenseIcon} from "@mui/icons-material";

export default function EntityItem(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const statNames = ["Brawn", "Agility", "Intellect", "Cunning", "Willpower", "Presence"];
  const statIcons = [PersonIcon, AgilityIcon, BrainIcon, CunningIcon, WillpowerIcon, PresenceIcon];
  const stats = props.entity.stats.split("/");
  const defenses = props.entity.defenses.split("/");
  const skills = props.entity.skills.split("/").join(", ");

  let drops = "";
  if (props.person === false) {
    drops = props.entity.drops.split("/").join(", ");
  }
  
  const talents = props.entity.talents.split("/");
  const abilities = props.entity.abilities.split("/");
  const actions = props.entity.actions.split("/");
  const equipment = props.entity.equipment.split("/").join(', ');

  const StatChip = ({ name, value, icon: Icon, index }) => (
    <Chip
      key={index}
      icon={<Icon sx={{ fontSize: '1rem' }} />}
      label={`${name}: ${value}`}
      variant="outlined"
      size={isMobile ? "small" : "medium"}
      sx={{
        mb: 0.5,
        mr: 0.5,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.primary.main}`,
        '& .MuiChip-icon': {
          color: theme.palette.primary.main
        }
      }}
    />
  );

  const InfoSection = ({ title, children, icon }) => (
    <Box sx={{ mb: 3 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 1.5, 
          color: theme.palette.primary.main,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        {icon && icon}
        {title}
      </Typography>
      {children}
    </Box>
  );

  const ListItem = ({ text, index }) => (
    <Typography 
      variant="body2" 
      sx={{ 
        mb: 1,
        pl: 2,
        position: 'relative',
        '&::before': {
          content: `"${index + 1}."`,
          position: 'absolute',
          left: 0,
          fontWeight: 600,
          color: theme.palette.primary.main
        }
      }}
    >
      {text}
    </Typography>
  );

  return (
    <Card 
      elevation={3}
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', md: '700px' },
        mx: 'auto',
        borderRadius: 2,
        overflow: 'visible',
        position: 'relative'
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        {/* Header Section */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            sx={{ 
              mb: 2, 
              fontWeight: 700,
              color: theme.palette.text.primary
            }}
          >
            {props.entity.name}
          </Typography>
          
          <Stack 
            direction={isMobile ? "column" : "row"} 
            spacing={1} 
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
          >
            {props.person === false && (
              <Chip 
                label={`Type: ${props.entity.type}`} 
                color="secondary"
                variant="filled"
              />
            )}
            <Chip 
              label={`Difficulty: ${props.entity.difficulty}`} 
              color="primary"
              variant="filled"
            />
            {props.person === false && (
              <Chip 
                label={`Fear: ${props.entity.fear === -1 ? Math.ceil(props.entity.difficulty / 2) : props.entity.fear}`}
                color="error"
                variant="filled"
              />
            )}
          </Stack>
        </Box>

        {/* Description */}
        {props.person === false && props.entity.description && (
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="body1" 
              sx={{ 
                fontStyle: 'italic',
                textAlign: 'center',
                color: theme.palette.text.secondary,
                backgroundColor: theme.palette.grey[50],
                p: 2,
                borderRadius: 1,
                border: `1px solid ${theme.palette.grey[200]}`
              }}
            >
              {props.entity.description}
            </Typography>
          </Box>
        )}

        {/* Stats Section */}
        <InfoSection title="Characteristics">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {stats.map((stat, index) => (
              <StatChip
                key={index}
                name={statNames[index]}
                value={stat}
                icon={statIcons[index]}
                index={index}
              />
            ))}
          </Box>
        </InfoSection>

        {/* Combat Stats */}
        <InfoSection title="Combat Stats" icon={<DefenseIcon />}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Chip 
                label={`Soak: ${props.entity.soak}`}
                variant="outlined"
                color="success"
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Chip 
                label={`Wounds: ${props.entity.wounds}`}
                variant="outlined"
                color="error"
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Chip 
                label={props.entity.strain === 0 ? "Strain: N/A" : `Strain: ${props.entity.strain}`}
                variant="outlined"
                color="warning"
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Chip 
                label={`Defense: ${defenses.join("/")}`}
                variant="outlined"
                color="info"
                sx={{ width: '100%' }}
              />
            </Grid>
          </Grid>
        </InfoSection>

        <Divider sx={{ my: 3 }} />

        {props.person === false && props.entity.behavior && (
          <InfoSection title="Behavior">
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              {props.entity.behavior}
            </Typography>
          </InfoSection>
        )}

        <InfoSection title="Skills">
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            {skills}
          </Typography>
        </InfoSection>

        {talents.length > 0 && talents[0] && (
          <InfoSection title="Talents">
            {talents.map((talent, index) => (
              <ListItem key={index} text={talent} index={index} />
            ))}
          </InfoSection>
        )}

        {abilities.length > 0 && abilities[0] && (
          <InfoSection title="Abilities">
            {abilities.map((ability, index) => (
              <ListItem key={index} text={ability} index={index} />
            ))}
          </InfoSection>
        )}

        {actions.length > 0 && actions[0] && (
          <InfoSection title="Actions">
            {actions.map((action, index) => (
              <ListItem key={index} text={action} index={index} />
            ))}
          </InfoSection>
        )}

        {equipment && (
          <InfoSection title="Equipment">
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              {equipment}
            </Typography>
          </InfoSection>
        )}

        {props.person === false && drops && (
          <InfoSection title="Drops">
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              {drops}
            </Typography>
          </InfoSection>
        )}
      </CardContent>
    </Card>
  );
}