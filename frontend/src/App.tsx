import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Carousel } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {

  const [allPhotos, setAllPhotos] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState({url:'', filename:''});
  const baseUri = process.env.REACT_APP_API_URL!;

  async function fetchPhotos() {
    const {data} = await axios.get(`${baseUri}/getAllPhotos`)
    setAllPhotos(data)
  }

  async function selectPhoto(photo:any) {
    const {data} = await axios.get(`${baseUri}/getAllPhotos/${photo.filename}`)
    setSelectedPhoto(data)
  }

  useEffect(() => {
    fetchPhotos();
  })
  
  function getCarouselImage(photo: any) {
    return (<Carousel.Item interval={1000} style={{height: 350}}>
      <img src={photo.url} alt={photo.filename} className='h-100' onClick={() => selectPhoto(photo)} />
      <Carousel.Caption><h3 style={{backgroundColor: 'rgba(0,0,0,0.3)'}}>{photo.filename}</h3></Carousel.Caption>
    </Carousel.Item>);
  }

  function SelectedImage() {
    if(selectedPhoto.url.length > 0) {
      return (<div>
        <h1>This is fetched by different API</h1>
        <img src={selectedPhoto?.url} alt={selectedPhoto?.filename} />
      </div>)
    } else {
      return (<h1>No Selected Image</h1>)
    }
  }

  return (
    <div className="App bg-secondary min-vh-100">
      <h1 className="display-3 p-3 mb-5">Super Mario and Friends</h1>
      <Carousel>
        {allPhotos.map(photo => getCarouselImage(photo))}
      </Carousel>
      <br />
      <SelectedImage></SelectedImage>
    </div>
  );
}

export default App;
