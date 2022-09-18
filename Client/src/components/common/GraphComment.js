import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

const GraphComment = () => {
  const [graph, setGraph] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    function AllTimestats() {
      try {
        axios.get("api/user/stat?isGraph=true").then((response) => {
          setGraph(response.data);
          if (response.data.code !== 200) throw navigate("/blogs");
        });
      } catch (err) {
        console.log(err);
      }
    }
    AllTimestats();
  }, []);


  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );



  // console.log(graph?.data[0]?.viewCount);

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thru", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Views",
        fill: false,
        borderColor: "orange",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        data: [
          graph?.data[0]?.commentCount,
          graph?.data[1]?.commentCount,
          graph?.data[2]?.commentCount,
          graph?.data[3]?.commentCount,
          graph?.data[4]?.commentCount,
          graph?.data[5]?.commentCount,
          graph?.data[6]?.commentCount,
          graph?.data[7]?.commentCount,
          graph?.data[8]?.commentCount,
        ],
        tension: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
  };

  return (
    <>
      <Line data={data} height={100} options={options} />
    </>
  );
};

export default GraphComment;
