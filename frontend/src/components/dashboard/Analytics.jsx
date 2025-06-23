// import React from 'react'

// const Analytics = () => {
//   return (
//     <div>
//       Analytics
//     </div>
//   )
// }

// export default Analytics










import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardTitle } from "../ui/Card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { StoreContext } from "../../context/StoreContext";

const COLORS = ["#FF6666", "#FFA500", "#3399FF", "#33CC66"];

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const token = localStorage.getItem("token");
  const {url} = useContext(StoreContext)

  useEffect(() => {
    const fetchAnalytics = async () => {
      const newUrl = `${url}/api/analytics/analytics`
      try {
        const res = await axios.get(newUrl, {
          headers: { token }
        });
        console.log("response: ", res.data)
        if (res.data.success) setAnalytics(res.data.data);
      } catch (err) {
        console.error("Failed to load analytics", err);
      }
    };
    fetchAnalytics();
  }, []);

  if (!analytics) return <p className="text-center mt-4">Loading analytics...</p>;

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardContent>
          <CardTitle className="text-xxl text-gray-900 my-[20px]">Summary</CardTitle>
          <p className="mb-[10px]">Total Cards: {analytics.totalCards}</p>
          <p className="mb-[10px]">Total Reviews: {analytics.totalReviews}</p>
          <p className="mb-[10px]">Average Quality: {analytics.avgQuality.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <CardTitle className="mt-[20px] mb-[30px]">Daily Reviews (Last 7 Days)</CardTitle>
          <BarChart width={500} height={300} data={analytics.dailyReviews}>
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3399FF" />
          </BarChart>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <CardTitle className="mt-[20px] mb-[30px]">Quality Breakdown</CardTitle>
          <PieChart width={400} height={300}>
            <Pie
              data={[
                { name: "Forgot", value: analytics.qualityBreakdown.forgot },
                { name: "Hard", value: analytics.qualityBreakdown.hard },
                { name: "Good", value: analytics.qualityBreakdown.good },
                { name: "Easy", value: analytics.qualityBreakdown.easy }
              ]}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {COLORS.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
