document.addEventListener('DOMContentLoaded', () => {
    /**要求1: 实现按钮打开关闭小组件 */
    const onOffButton = document.getElementById('on-off');
    const weatherContainer = document.getElementById('weather-container');

    weatherContainer.style.display = 'block';

    onOffButton.addEventListener('click', () => {
        if (weatherContainer.style.display === 'none') {
            weatherContainer.style.display = 'block';
            onOffButton.textContent = "关闭实时天气面板";
        } else {
            weatherContainer.style.display = 'none';
            onOffButton.textContent = "打开实时天气面板";
        }
    });


    /**要求2: 可拖拽小组件 */
    let isDragging = false;
    let offsetX, offsetY;

    weatherContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - weatherContainer.offsetLeft;
        offsetY = e.clientY - weatherContainer.offsetTop;
        weatherContainer.style.cursor = 'move';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;

        weatherContainer.style.left = x + 'px';
        weatherContainer.style.top = y + 'px';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        weatherContainer.style.cursor = 'default';
    });


    /**要求3: 选择城市后，经纬度对应变化 */
    const citySelect = document.getElementById('weather-city-select');
    const cityLongitude = document.getElementById('lon-td');
    const cityLatitude = document.getElementById('lat-td');
    
    let cities = []; 
    
    fetch('CityLocation.json')
        .then(response => response.json())
        .then(data => {
            cities = data; // Assign fetched data to the cities variable
            // 第一个城市
            cityLongitude.textContent = cities[0].longitude;
            cityLatitude.textContent = cities[0].latitude;


            citySelect.onchange = function() {
                const selectedCityName = citySelect.value;

                const selectedCity = cities.find(city => city.city === selectedCityName);

                if (selectedCity) {
                    cityLongitude.textContent = selectedCity.longitude;
                    cityLatitude.textContent = selectedCity.latitude;
                }
            };
        })

    /**要求四: 获取实时数据 */
    const weatherButton = document.getElementById('weather-button');

    weatherButton.addEventListener('click', () => {
        const selectedCityName = citySelect.value;
        const selectedCity = cities.find(city => city.city === selectedCityName);

        if (!selectedCity) {
          console.error('未找到城市');
          return;
        }

        const lat = selectedCity.latitude;
        const lon = selectedCity.longitude;
        const apiKey = 'd57f9db3e1f698c12e4a740e77f32e79';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=zh_cn`;

        axios.get(url)
          .then(res => {
            console.log(res.data); // 在控制台输出返回体
            updateWeatherComponent(res.data); // 调用函数更新天气组件
          })
          .catch(err => {
            console.error('Error fetching weather data:', err);
          });
      });


      /**要求5：实现相关变化 */
    function updateWeatherComponent(data) {
        const weatherComponent = document.getElementById('weather-component');

        if (!weatherComponent) {
            console.error('Weather component not found.');
            return;
        }

        const temperature = data.main.temp;
        const weatherDescription = data.weather[0].description;
        const cityName = data.name;
        const cityMap = {
            "Sijiqing": "杭州", // 经纬度差别，强行校正
            "Ningbo": "宁波",
            "Wenzhou": "温州",
            "Jiefang": "嘉兴", // 经纬度差别，强行校正
            "Longquan": "湖州" // 经纬度差别，强行校正
        };
        
        const cityName_cn = cityMap[cityName];
        const weatherIcon = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

        // 更新天气小组件的内容
        weatherComponent.querySelector('img').src = iconUrl;
        weatherComponent.querySelector('img').alt = weatherDescription;
        weatherComponent.querySelector('.left-text h3').textContent = `${temperature}°C`;
        weatherComponent.querySelector('.left-text p:first-of-type b').textContent = data.weather[0].main; // 天气状况
        weatherComponent.querySelector('.left-text p:last-child').textContent = weatherDescription; // 详细描述
        weatherComponent.querySelector('.right-text').textContent = cityName_cn;
    }

});
