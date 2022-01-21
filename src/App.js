import React, { Component } from "react";
import './App.css';
import MeuCompomente, { MeusComponentes } from "./components/MeuComponente";
import VideoList from "./components/VideoList";
import VideoPlayer from "./components/VideoPlayer";
import VideoCinema from "./components/VideoCinema";
import { VideoService } from './services/VideoService';
import { Channel } from "./services/EventService";
import VideoInline from "./components/VideoInline";

import { MyContext } from "./services/MyContext";

class App extends (Component) {
  constructor(props) {
    super(props);

    this.selectedVideo = this.selectedVideo.bind(this);
    this.toggleCinema = this.toggleCinema.bind(this);

    this.inlineVideo = React.createRef();
    this.cinemaVideo = React.createRef();
    this.state = {
      videos: [],
      selectedVideo: {},
      videoContainerElement: this.inlineVideo
    }
  }

  async componentDidMount() {
    const videos = await VideoService.list()
    this.setState({ videos });
    Channel.on('video:select', this.selectedVideo)
    Channel.on('video:toggle-cinema', this.toggleCinema)
  }

  componentWillUnmount() {
    Channel.removeListener('video:select', this.selectedVideo);
    Channel.removeListener('video:toggle-cinema', this.toggleCinema);

  }

  toggleCinema() {
    const currentElement = this.state.videoContainerElement,
      newContainer = currentElement === this.inlineVideo ? this.cinemaVideo : this.inlineVideo;
    this.setState({
      videoContainerElement: newContainer
    })
  }

  selectedVideo(video) {
    this.setState({ selectedVideo: video });
  }
  
  render() {
    const { state } = this;
      return (
        <div className="App">
          <MeuCompomente />
          <MeusComponentes.VemPraKi />
          
          <VideoPlayer video={state.selectedVideo} container={state.videoContainerElement.current} />
          <VideoInline>
            <div ref={this.inlineVideo}>

            </div>
          </VideoInline>
          <VideoList videos={state.videos} />
          <VideoCinema isActive={state.videoContainerElement === this.cinemaVideo}>
            <div ref={this.cinemaVideo}></div>
          </VideoCinema>
        </div>
    );
  }
}

export default App;
