import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [areas, setAreas] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("270000"); // 初期値：大阪
  const [weatherData, setWeatherData] = useState(null);

  // publicに置いたXML読み込み
  useEffect(() => {
    axios.get(`${import.meta.env.BASE_URL}primary_area.xml`)
      .then((res) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(res.data, "text/xml");

        const prefs = Array.from(xml.getElementsByTagName("pref"));

        const parsed = prefs.map((pref) => {
          const prefTitle = pref.getAttribute("title");

          const cities = Array.from(
            pref.getElementsByTagName("city")
          ).map((city) => ({
            title: city.getAttribute("title"),
            id: city.getAttribute("id"),
          }));

          return {
            prefTitle,
            cities,
          };
        });

        setAreas(parsed);
      })
      .catch(console.error);
  }, []);

  // 天気取得
  useEffect(() => {
    axios.get(
        `https://weather.tsukumijima.net/api/forecast/city/${selectedCityId}`
      )
      .then((response) => {
        const data = response.data;

        const sorted = [...data.forecasts].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setWeatherData({
          ...data,
          forecasts: sorted,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedCityId]);

  if (!weatherData) return <div>画面読み込み中...</div>;

  return (
    <div style={{ padding: "20px" }}>
      {/* タイトル */}
      <h2 style={{ marginTop: 0 }}>{weatherData.title}</h2>

      <div style={{ marginBottom: "15px" }}>
        <select
          value={selectedCityId}
          onChange={(e) => setSelectedCityId(e.target.value)}
        >
          {areas.map((area) => (
            <optgroup key={area.prefTitle} label={area.prefTitle}>
              {area.cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

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
          backgroundColor: "#fffeff",
          lineHeight: "1.2",
        }}
      >
        {weatherData.description.bodyText}
      </div>

      {/* 提供元リンク */}
      <div style={{ marginTop: "30px", marginBottom: "10px" }}>
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
            <th>降水確率</th>
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
              <td style={{ lineHeight: "1.6" ,padding: "5px" }}>00～06 時：{item.chanceOfRain.T00_06}<br />
                  06～12 時：{item.chanceOfRain.T06_12}<br />
                  12～18 時：{item.chanceOfRain.T12_18}<br />
                  18～24 時：{item.chanceOfRain.T18_24}
                  </td>
              <td>{item.temperature.min?.celsius ?? "--"}℃</td>
              <td>{item.temperature.max?.celsius ?? "--"}℃</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;