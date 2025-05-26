import { Box, Card, Chip, Typography, CardContent,CardHeader,Stack,Paper,Fade,Tooltip,IconButton,Avatar } from "@mui/material";
import { Science,Help,Flare,Psychology,Visibility,AutoAwesome,Category,Straighten,Info } from '@mui/icons-material';

export default function PhenomenonItem(props) {
  const descriptionSegments = props.currPhenomenon.description.split('/');
  const effectSegments = props.currPhenomenon.effect.split('/');

  // Get phenomenon type icon and color
  const getTypeInfo = (type) => {
    const typeMap = {
      'Magical': { icon: <AutoAwesome />, color: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)' },
      'Psychological': { icon: <Psychology />, color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
      'Physical': { icon: <Science />, color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' },
      'Environmental': { icon: <Flare />, color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
      'Temporal': { icon: <Visibility />, color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }
    };
    return typeMap[type] || { icon: <Science />, color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
  };

  // Get size color
  const getSizeColor = (size) => {
    const sizeMap = {
      'Small': 'success',
      'Medium': 'warning', 
      'Large': 'error',
      'Massive': 'secondary'
    };
    return sizeMap[size] || 'primary';
  };

  const typeInfo = getTypeInfo(props.currPhenomenon.type);

  const InfoSection = ({ title, segments, showEffectsIcon = false }) => (
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
      <Box display="flex" alignItems="center" gap={1} mb={1.5}>
        {showEffectsIcon ? <Flare /> : <Info />}
        <Typography variant="h6" fontWeight="bold" color="white">
          {title}
        </Typography>
      </Box>
      <Stack spacing={1.5}>
        {segments.map((segment, index) => {
          const parts = segment.split(':');
          const hasLabel = parts.length > 1 && parts[0] && parts[1];
          
          return (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: 1.5,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <Typography 
                variant="body2" 
                color="rgba(255,255,255,0.9)"
                sx={{ lineHeight: 1.5 }}
              >
                {hasLabel ? (
                  <>
                    <Typography 
                      component="span" 
                      fontWeight="bold" 
                      color="white"
                      sx={{ 
                        display: 'inline-block',
                        mb: 0.5,
                        fontSize: '0.875rem'
                      }}
                    >
                      {parts[0]}:
                    </Typography>
                    <br />
                    {parts[1]}
                  </>
                ) : (
                  segment
                )}
              </Typography>
            </Paper>
          );
        })}
      </Stack>
    </Paper>
  );

  return (
    <Fade in timeout={500}>
      <Card 
        elevation={8}
        sx={{
          width: { xs: '100%', md: '420px' },
          height: '400px',
          borderRadius: 4,
          background: typeInfo.color,
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
                border: '2px solid rgba(255,255,255,0.3)'
              }}
            >
              {typeInfo.icon}
            </Avatar>
          }
          title={
            <Typography variant="h5" fontWeight="bold" color="white">
              {props.currPhenomenon.name}
            </Typography>
          }
          action={
            props.currPhenomenon.notes && (
              <Tooltip 
                title={
                  <Typography variant="body2" sx={{ maxWidth: 300 }}>
                    {props.currPhenomenon.notes}
                  </Typography>
                } 
                arrow
                enterTouchDelay={10}
                placement="left"
              >
                <IconButton sx={{ color: 'white' }}>
                  <Help />
                </IconButton>
              </Tooltip>
            )
          }
          subheader={
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip
                icon={<Category />}
                label={props.currPhenomenon.type}
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
              <Chip
                icon={<Straighten />}
                label={props.currPhenomenon.size}
                size="small"
                color={getSizeColor(props.currPhenomenon.size)}
                sx={{ fontWeight: 'bold' }}
              />
            </Stack>
          }
          sx={{ pb: 1 }}
        />

        {/* Content */}
        <CardContent sx={{ 
          height: 'calc(100% - 120px)', 
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
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(255,255,255,0.5)',
          },
        }}>
          
          {/* Description */}
          <InfoSection 
            title="Description" 
            segments={descriptionSegments}
          />

          {/* Effects */}
          <InfoSection 
            title="Effects" 
            segments={effectSegments}
            showEffectsIcon={true}
          />
        </CardContent>

        {/* Decorative Bottom Accent */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'rgba(255,255,255,0.3)'
          }}
        />
      </Card>
    </Fade>
  )
}