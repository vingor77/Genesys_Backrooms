import { Link, Typography } from "@mui/material";

export default function NotLoggedIn() {
  return <Typography>You are not logged in. To access this page, please <Link href='/login' underline="hover">Login</Link></Typography>
}