import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CareerSelect from "./CareerSelect"
import SearchCompany from './SearchCompany'
import SearchMentor from './SearchMentor';
import { useState, useEffect } from 'react';
import Page from './Page';
import cards from "./sample"
import { useNavigate, Link } from 'react-router-dom';
import { getToken } from '../util/auth';


const theme = createTheme();

export default function Album() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [listPerPage, setListPerPage] = useState(9)
  const [allProjects, setAllProjects] = useState([])
  const [allProjectsFiltered, setAllProjectsFiltered] = useState([])
  const [career, setCareer] = useState('');
  const [mentor, setMentor] = useState('')
  const [company, setCompany] = useState('')

  const changePage = (pageNumber) => setCurrentPage(pageNumber)
  const indexOfLastList = currentPage * listPerPage
  const indexOfFirstList = indexOfLastList - listPerPage
  const currentListings = allProjectsFiltered.slice(indexOfFirstList, indexOfLastList)
  const numberOfPages = Math.ceil(allProjectsFiltered.length / listPerPage)

  const getAllProjects = () => {
    const requestOption = {
      method: "GET",
      headers: {
          'Content-Type': 'application/json',
      },
    }
    fetch("http://127.0.0.1:5000/published_project", requestOption)
    .then(res => {
        if(res.status === 200) {
            return res.json()
        } else {
            throw(res)
        }
    })
    .then(data => {
      // filter is not rquired in the final version, but now
      // it is used to rule out projects without company attribute
      // otherwise, reading null error will be raise when search for company
      // console.log(data.published_projects.filter((project) => {
      //   return project.company !== null
      // }));
      // setAllProjects(data.published_projects.filter((project) => {
      //   return project.company !== null
      // }))
      // setAllProjectsFiltered(data.published_projects.filter((project) => {
      //   return project.company !== null
      // }))
      const reversedList = data.published_projects
      reversedList.reverse()
      setAllProjects(reversedList)
      setAllProjectsFiltered(reversedList)
    })
    .catch(error => {
      console.log(error);
      alert(error)
    })
  }

  useEffect(() => {
    getAllProjects()
    console.log(getToken());
  },[])

  const goToDetail = () => {
    navigate('/project-detail')
  }

  const onSearch = () => {
    const newList = allProjects.filter(project => {
      return (
        (career ? project.category.toUpperCase().includes(career.toUpperCase()): true)
        && (mentor ? mentor.toUpperCase().includes(project.owner.toUpperCase()) : true)
        && (company ? company.toUpperCase().includes(project.company.toUpperCase()) : true)
      )

    })
    setAllProjectsFiltered(newList)
    setCareer("")

  }
  const onReset = () => {
    setAllProjectsFiltered(allProjects)
    setCompany('')
    setMentor('')
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="100%">
            <Stack
              sx={{ pt: 3}}
              direction="row"
              spacing={2}
              justifyContent="center"
            > 
              <SearchCompany company={company} setCompany={setCompany}/>
              <SearchMentor mentor={mentor} setMentor={setMentor}/>
            </Stack>
            <Stack
              sx={{ pt: 3}}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <CareerSelect career={career} setCareer={setCareer}/>
              <Button variant="contained" size="small" 
                style={{maxHeight: '56px', maxWeight: '100px', minWidth: '100px', minHeight: '56px'}}
                onClick={onSearch}
                >Search
              </Button>
              <Button variant="outlined" size="small" 
                style={{maxHeight: '56px', maxWeight: '100px', minWidth: '100px', minHeight: '56px'}}
                onClick={onReset}
                >Reset
              </Button>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {currentListings.map((card, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="img"
                    // image={card.picture? `data:image/png;base64,${card.picture}`: "https://source.unsplash.com/random"}
                    image={'https://images.unsplash.com/photo-1510906594845-bc082582c8cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2044&q=80'}
                    alt="random"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.company}
                    </Typography>
                    <Typography>
                      {card.title}
                    </Typography>
                    <br></br>
                    <Typography>
                      {card.category}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Link to={`/project-detail/${card.project_id}`}>
                      <Button size="small">View</Button>
                    </Link>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box 
        sx={{ bgcolor: 'background.paper', p: 6, display: 'flex', justifyContent: 'center' }} 
        component="footer" 
      >
        <Page numberOfPages={numberOfPages} changePage={changePage}/>
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}
