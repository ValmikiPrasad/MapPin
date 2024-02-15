import React, { Component, useEffect, useState } from "react";

import ReactMapGL from "react-map-gl";
import { Marker } from "react-map-gl";
import { Popup } from "react-map-gl";
import { Room, Star } from "@material-ui/icons";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import { format } from "timeago.js";
import Register from "./coponents/Register";
import Login from "./coponents/Login";
function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(null);
  const [pins, setPins] = useState([]);
  const [currentPinId, setCurrentPinId] = useState(null);

  const [newPinId, setNewPinId] = useState(null);

  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [rating, setRating] = useState(0);

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [viewport, setviewport] = useState({
    width: "100vw",
    height: "100vh",
    longitude: 77.2295,
    latitude: 28.612894,
    zoom: 4,
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, longi, lati) => {
    setCurrentPinId(id);
    setviewport({ ...viewport, longitude: longi, latitude: lati });
  };

  const handleDoubleClick = (e) => {
    const u=myStorage.getItem("user")
    if(u==null){
      return;
    }
    const [lng, lat] = e.lngLat.toArray();
    setNewPinId({ lat: lat, lng: lng });
    console.log("clicked co-ordinate");
    console.log("latitude " + lat);
    console.log("longitude " + lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title: title,
      description: description,
      rating: rating,
      latitude: newPinId.lat,
      longitude: newPinId.lng,
    };
    try {
      const res = await axios.post("http://localhost:8080/api/pins", newPin);
      setPins([...pins, res.data]);
      setNewPinId(null);
    } catch (err) {
      console.log(err);
    }
  };
  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <>
      <div className="App">
        <ReactMapGL
          initialViewState={{ ...viewport }}
          // {...viewport}
          style={{ width: "100vw", height: "100vh" }}
          mapboxAccessToken={process.env.REACT_APP_MAPBOX}
          onViewportChange={(viewport) => setviewport(viewport)}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          onDblClick={handleDoubleClick}
          transitionDuration={100}
        >
          {pins.map((pin) => (
            <>
              <Marker longitude={pin.longitude} latitude={pin.latitude}>
                <Room
                  style={{
                    fontSize: viewport.zoom * 7,
                    color: pin.username === currentUser ? "red" : "purple",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleMarkerClick(pin._id, pin.longitude, pin.latitude)
                  }
                />
              </Marker>
              {pin._id === currentPinId && (
                <Popup
                  longitude={pin.longitude}
                  latitude={pin.latitude}
                  closeButton={true}
                  closeOnClick={false}
                  onClose={() => setCurrentPinId(null)}
                  anchor="left"
                >
                  <div className="card">
                    <lable className="AA">Place</lable>
                    <h3 className="pinlace">{pin.title}</h3>
                    <label>Review</label>
                    <p className="desc">{pin.description}</p>
                    <label>Rating</label>
                    <div className="stars">
                      {Array(pin.rating).fill(<Star className="star" />)}
                    </div>
                    <labl>Info</labl>
                    <span className="username">
                      {" "}
                      created by <b>{pin.username}</b>
                    </span>
                    <span className="date">{format(pin.createdAt)}</span>
                  </div>
                </Popup>
              )}
            </>
          ))}
          {newPinId && (
            <Popup
              longitude={newPinId.lng}
              latitude={newPinId.lat}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewPinId(null)}
              anchor="left"
            >
              <div>
                <form className="createPin" onSubmit={handleSubmit}>
                  <div className="title">
                    <label>Title</label>
                    <input
                      placeholder="Enter a Title"
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                    />
                  </div>
                  <div className="review">
                    <label>Review</label>
                    <textarea
                      placeholder="Say us something about this place."
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                    />
                  </div>
                  <div className="rating">
                    <label>Rating</label>
                    <select
                      onChange={(e) => {
                        setRating(e.target.value);
                      }}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>

                  <button className="submitButton" type="submit">
                    Add Pin
                  </button>
                </form>
              </div>
            </Popup>
          )}
          {currentUser ? (
            <div className="buttons">
              <button className="button logout" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          ) : (
            <div className="buttons">
              <button
                className="button login"
                onClick={() => {
                  setShowLogin(true);
                }}
              >
                Login
              </button>
              <button
                className="button hi"
                onClick={() => {
                  setShowRegister(true);
                }}
              >
                Register
              </button>
            </div>
          )}
          {showRegister && <Register setShowRegister={setShowRegister} />}
          {showLogin && (
            <Login
              setShowLogin={setShowLogin}
              myStorage={myStorage}
              setCurrentUser={setCurrentUser}
            />
          )}
        </ReactMapGL>
      </div>
    </>
  );
}
export default App;
