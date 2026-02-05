import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"
import { fetchForecast } from "@/lib/api"
import { useEffect, useState } from "react"

export default function RiskChart() {
    const [chartData, setChartData] = useState([
        { name: "Jan", risk: 40, events: 24 },
        { name: "Feb", risk: 30, events: 13 },
        { name: "Mar", risk: 20, events: 98 },
        { name: "Apr", risk: 27, events: 39 },
        { name: "May", risk: 18, events: 48 },
        { name: "Jun", risk: 23, events: 38 },
        { name: "Jul", risk: 34, events: 43 },
    ]);

    useEffect(() => {
        async function updateForecast() {
            try {
                const forecast = await fetchForecast(2024, 8);
                setChartData(prev => [
                    ...prev,
                    { name: "Aug (Pred)", risk: 35, events: forecast.predicted_count }
                ]);
            } catch (e) {
                console.error("Forecast fetch failed", e);
            }
        }
        updateForecast();
    }, []);

    return (
        <div className="w-full h-full min-h-[100px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                    <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{
                            backgroundColor: 'rgba(5, 5, 17, 0.8)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '12px',
                            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                        }}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                        iconType="circle"
                    />
                    <Bar
                        dataKey="risk"
                        fill="#06b6d4"
                        radius={[4, 4, 0, 0]}
                        name="Risk Score"
                        maxBarSize={40}
                    />
                    <Bar
                        dataKey="events"
                        fill="#ef4444"
                        radius={[4, 4, 0, 0]}
                        name="Event Count"
                        maxBarSize={40}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
