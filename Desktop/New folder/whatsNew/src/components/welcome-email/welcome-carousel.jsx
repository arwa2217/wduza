import React from "react";
import Carousel from "react-bootstrap/Carousel";
import { makeStyles } from "@material-ui/core";
import slide1 from "../../assets/icons/welcome-page/slide-1.svg";
import slide2 from "../../assets/icons/welcome-page/slide-2.svg";
import slide3 from "../../assets/icons/welcome-page/slide-3.svg";

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
    "& a": {
      display: "none",
    },
    "& li": {
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      backgroundColor: "#C4C4C4",
    },
    "& .carousel-indicators": {
      "& .active": {
        backgroundColor: "#03BD5D",
      },
    },
  },
  title: {
    color: "#03BD5D",
    fontWeight: "bold",
    fontSize: "20px",
  },
  image: {
    width: "100%",
    height: "124px",
  },
  caption: {
    color: "#666666",
    position: "relative",
    fontWeight: "400",
    fontSize: "15px",
    right: 0,
    left: 0,
    paddingTop: "60px",
    paddingBottom: "45px",
  },
});

const WelcomeCarousel = () => {
  const classes = useStyles();

  return (
    <Carousel variant="dark" className={classes.root}>
      <Carousel.Item>
        <img src={slide1} alt="First slide" className={classes.image} />
        <Carousel.Caption className={classes.caption}>
          <p className={classes.title}>Lorem ipsum dolor sit amet</p>
          <p>
            Nunc tincidunt, eros eu consequat dictum, quam justo lobortis nisi,
            vel tincidunt diam lacus non sem.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src={slide2} alt="Second slide" className={classes.image} />
        <Carousel.Caption className={classes.caption}>
          <p className={classes.title}>Lorem ipsum dolor sit amet</p>
          <p>
            Nunc tincidunt, eros eu consequat dictum, quam justo lobortis nisi,
            vel tincidunt diam lacus non sem.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src={slide3} alt="Third slide" className={classes.image} />
        <Carousel.Caption className={classes.caption}>
          <p className={classes.title}>Lorem ipsum dolor sit amet</p>
          <p>
            Nunc tincidunt, eros eu consequat dictum, quam justo lobortis nisi,
            vel tincidunt diam lacus non sem.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default WelcomeCarousel;
