import { Paper, Typography, useTheme } from '@mui/material'
import FlexBetween from '../components/share/FlexBetween'
import { Link } from 'react-router-dom'

const Footer = () => {
  const theme = useTheme();
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        width: "100%", 
        py: 3,
        px: 5, 
        background: theme.palette.background.default,
        borderTop: 1,
        borderColor: theme.palette.background.alt
      }}
    >
      <FlexBetween>
        <Typography >© 2025, xây dựng bởi TeAing</Typography>
        <Typography >
          <Link>GitHub</Link>
        </Typography>
      </FlexBetween>
    </Paper>
  )
}

export default Footer