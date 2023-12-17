import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";

interface WelcomeImageProps {
  hourCount: number;
}
interface WelcomeImage {
  imageUrl: string;
  imageName: string;
}

const WelcomeImage: React.FC<WelcomeImageProps> = ({ hourCount }) => {
  const [hourToImageMap, setHourToImageMap] = useState<WelcomeImage[]>([]);
  const [status, setStatus] = useState<string>("not-loaded");

  const constructHourToImageMap = async () => {
    const response = await fetch("/api/getWelcomeImages", {
      method: "GET",
    });
    const data = await response.json();

    const imageUrls = data.imageUrls;
    const imageNames = data.imageNames;

    let hourToImageMap = [];

    // Find image indexes
    const sleepIndex = imageNames.indexOf("sleep.png");
    const alarmIndex = imageNames.indexOf("statue_alarm.png");
    const morningBrushIndex = imageNames.indexOf("brushing.png");
    const workoutIndex = imageNames.indexOf("workout.png");
    const rideToWorkIndex = imageNames.indexOf("ride_to_work.png");
    const morningWorkIndex = imageNames.indexOf("work.png");
    const lunchIndex = imageNames.indexOf("lunch.png");
    const afternoonWorkIndex = imageNames.indexOf("afternoon_work.png");
    const rideFromWorkIndex = imageNames.indexOf("ride_back_from_work.png");
    const rideToTennisIndex = imageNames.indexOf("ride_to_tennis.png");
    const tennisIndex = imageNames.indexOf("tennis.png");
    const rideFromTennisIndex = imageNames.indexOf("ride_back_from_tennis.png");
    const cookingDinnerIndex = imageNames.indexOf("cooking_dinner.png");
    const eatingDinnerIndex = imageNames.indexOf("eating_dinner.png");
    const watchingTVIndex = imageNames.indexOf("watching_tv.png");
    const doingDishesIndex = imageNames.indexOf("doing_dishes.png");
    const nightBrushingIndex = imageNames.indexOf("bedtime_brush.png");

    //Construct map sequentially from images
    for (let i = 0; i < 7; i++) {
      hourToImageMap.push({
        imageUrl: imageUrls[sleepIndex],
        imageName: imageNames[sleepIndex],
      });
    }
    hourToImageMap.push({
      imageUrl: imageUrls[alarmIndex],
      imageName: imageNames[alarmIndex],
    });
    hourToImageMap.push({
      imageUrl: imageUrls[morningBrushIndex],
      imageName: imageNames[morningBrushIndex],
    });
    hourToImageMap.push({
      imageUrl: imageUrls[workoutIndex],
      imageName: imageNames[workoutIndex],
    });
    hourToImageMap.push({
      imageUrl: imageUrls[rideToWorkIndex],
      imageName: imageNames[rideToWorkIndex],
    });
    hourToImageMap.push({
      imageUrl: imageUrls[morningWorkIndex],
      imageName: imageNames[morningWorkIndex],
    });
    hourToImageMap.push({
      imageUrl: imageUrls[lunchIndex],
      imageName: imageNames[lunchIndex],
    });
    hourToImageMap.push({
      imageUrl: imageUrls[afternoonWorkIndex],
      imageName: imageNames[afternoonWorkIndex],
    });
    hourToImageMap.push({
      imageUrl: imageUrls[rideFromWorkIndex],
      imageName: imageNames[rideFromWorkIndex],
    });
    hourToImageMap.push({
      imageUrl: imageUrls[rideToTennisIndex],
      imageName: imageNames[rideToTennisIndex],
    });
    hourToImageMap.push({
      imageUrl: imageUrls[tennisIndex],
      imageName: imageNames[tennisIndex],
    });
    hourToImageMap.push({
      imageUrl: imageUrls[rideFromTennisIndex],
      imageName: imageNames[rideFromTennisIndex],
    });
    hourToImageMap.push({
      imageUrl: imageUrls[cookingDinnerIndex],
      imageName: imageNames[cookingDinnerIndex],
    });
    hourToImageMap.push({
      imageUrl: imageUrls[eatingDinnerIndex],
      imageName: imageNames[eatingDinnerIndex],
    });
    hourToImageMap.push({
      imageUrl: imageUrls[watchingTVIndex],
      imageName: imageNames[watchingTVIndex],
    });
    hourToImageMap.push({
      imageUrl: imageUrls[doingDishesIndex],
      imageName: imageNames[doingDishesIndex],
    });
    hourToImageMap.push({
      imageUrl: imageUrls[nightBrushingIndex],
      imageName: imageNames[nightBrushingIndex],
    });
    hourToImageMap.push({
      imageUrl: imageUrls[sleepIndex],
      imageName: imageNames[sleepIndex],
    });

    setHourToImageMap(hourToImageMap);
    setStatus("loaded");
  };

  useEffect(() => {
    constructHourToImageMap();
  }, []);

  return (
    <div>
      {status == "not-loaded" && <p>Loading...</p>}
      {status == "loaded" && (
        <Image
          src={hourToImageMap[hourCount].imageUrl}
          alt={hourToImageMap[hourCount].imageName}
          width={350}
          height={350}
        />
      )}
    </div>
  );
};

export default WelcomeImage;
