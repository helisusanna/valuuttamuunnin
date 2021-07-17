import { useState, useEffect } from "react";

import { Container,
        Typography,
        Grid,
        FormControl,
        Input,
        InputLabel,
        InputAdornment,
        Select,
        Button, } from "@material-ui/core"

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  gridItem: {
    margin: theme.spacing(2),
  },
  form: {
    maxWidth: "380px"
  },
  header: {
    marginBottom: theme.spacing(3),
  }
}));

function App() {

  const [euromaara, setEuromaara] = useState("");
  const [valittuValuutta, setValittuValuutta] = useState("");
  const [tulos, setTulos] = useState("");
  const [data, setData] = useState({
    haetutValuutat : [],
    virhe : null,
    tiedotHaettu: false
  });

  const haeTiedot = async () => {

    try {

      const yhteys = await fetch("http://api.exchangeratesapi.io/v1/latest?access_key=580bc4f076b0cee3db10de2ece11a4ac");
      const tiedot = await yhteys.json();
  
      setData({
                ...data,
                haetutValuutat : tiedot,
                tiedotHaettu : true
              });

    } catch (e) {

      setData({
                ...data,
                virhe : `Palvelimeen ei saatu yhteyttä`,
                tiedotHaettu : true
              });

    }

  }

  useEffect(() => {
    haeTiedot();
  }, []);

  const haevaluutat = () => {
    let select = [];
    for(const valuutta in data.haetutValuutat.rates){
      select.push(<option value={`${valuutta}`}>{`${valuutta} (${data.haetutValuutat.rates[valuutta]})`}</option>)
    }
    return select
  }
  
  const laskeMuunnos = () => {

    let kerroin = 0;

    for(const valuutta in data.haetutValuutat.rates){

      if(valuutta == valittuValuutta){
        kerroin = data.haetutValuutat.rates[valuutta]
      }

    }

    let laske = kerroin * euromaara;
    laske = laske.toFixed(2);

    setTulos(`Muunnoksen tulos: ${euromaara} EUR = ${laske} ${valittuValuutta}`);
    
  }
  const classes = useStyles();

  return (
    <Container fixed>
      <Typography variant="h5" className={classes.header}>Valuuttamuunnin</Typography>

      <Grid container>

        <Grid item xs={12} className={classes.gridItem}>
          <FormControl fullWidth className={classes.form}>
              <InputLabel htmlFor="standard-adornment-amount">Muunnettava euromäärä</InputLabel>
              <Input
                type="number"
                onChange={(e) => {
                  setEuromaara(e.target.value);
                }}      
                startAdornment={<InputAdornment position="start">€</InputAdornment>}
              />
          </FormControl>
        </Grid>

        <Grid item xs={12} className={classes.gridItem}>
          {(!data.tiedotHaettu)
          ? <Typography>Tietoja haetaan, odota hetki...</Typography>
          : (!data.virhe)
            ? <FormControl fullWidth className={classes.form}>
                <InputLabel htmlFor="standard-adornment-amount">Muunna valuutaksi</InputLabel>
                <Select
                  native
                  value={valittuValuutta} 
                  onChange={(e) => {setValittuValuutta(e.target.value);}}
                >
                  <option aria-label="Ei valittu" value="" />
                  {haevaluutat()}
                </Select>
              </FormControl>
            : <Typography>{data.virhe}</Typography>
          }
         </Grid>

         <Grid item xs={12} className={classes.gridItem}>
            <Button variant="contained" color="secondary" onClick={laskeMuunnos}>
              Laske valuuttamuunnos
            </Button>
          </Grid>

          <Grid item xs={12} className={classes.gridItem}>
            {(!tulos)
            ? null
            : <Typography>{tulos}</Typography>
            }
          </Grid>
      </Grid>

    </Container>
  );
}

export default App;

