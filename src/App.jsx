import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    axios
      .get("https://weather.tsukumijima.net/api/forecast/city/270000")
      .then((response) => {
        const data = response.data;

        const sorted = [...data.forecasts].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setWeatherData({
          ...data,
          forecasts: sorted
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (!weatherData) return <div>画面読み込み中...</div>;

  return (
    <div style={{ padding: "20px" }}>
      {/* タイトル */}
      <h2 style={{ marginTop: 0 }}>{weatherData.title}</h2>

      {/* 概要テキスト */}
      <div
  style={{
    display: "inline-block",
    whiteSpace: "pre-line",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "12px",
    paddingLeft: "0px",
    marginTop: "10px",
    backgroundColor: "#fffbff",
    lineHeight: "1.2"
  }}
>
  {weatherData.description.bodyText}
</div>

      {/* 提供元リンク */}
      <div style={{ marginTop: "30px", marginBottom: "10px"  }}>
        <a
          href={weatherData?.copyright?.provider?.[0]?.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {weatherData?.copyright?.title}
        </a>
      </div>

      {/* 天気テーブル */}
      <table border="1" cellPadding="3">
        <thead>
          <tr>
            <th>日付</th>
            <th>区分</th>
            <th>天気</th>
            <th>天気詳細</th>
            <th>最低気温</th>
            <th>最高気温</th>
          </tr>
        </thead>
        <tbody>
          {weatherData.forecasts.map((item) => (
            <tr key={item.date}>
              <td>{item.date}</td>
              <td>{item.dateLabel}</td>
              <td>
                <img src={item.image.url} alt={item.telop} />
                <br />
                {item.telop}
              </td>
              <td>{item.detail.weather ?? "詳細データ無し"}</td>
              <td>{item.temperature.min.celsius ?? "--"}℃</td>
              <td>{item.temperature.max.celsius ?? "--"}℃</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;