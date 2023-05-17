import './App.css';
import { useState, useEffect } from 'react';




function App() {
  const [thumbnail, setThumbnail] = useState('');
  const [vid, setVid] = useState([]);
  const [theme, setTheme] = useState('dark');
  


  /**********************/
  
   useEffect(() => {
    const html = document.querySelector('html');
    if (localStorage.getItem('theme') === 'dark') {
      html.classList.add('dark');
      setTheme('dark')
    } else{
      html.classList.remove('dark')
      setTheme('light')
    }
  },[theme])

  const handleThemeSwitch = ()=> {
    if (localStorage.getItem('theme') === 'light') {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      localStorage.setItem('theme', 'light')
    }
  } 
/**********************/
  
  async function fetchData(videoId) {
    const apiKey = 'AIzaSyB156gDWxJuSOJeO2-3yoKoAscoKXMV5oQ';
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.items.length > 0) {
        const thumbnailUrl = data.items[0].snippet.thumbnails.default.url;
        const title = data.items[0].snippet.title;
        console.log(title)
        setVid([...vid, [videoId, thumbnailUrl, title]]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const addVid = () => {
    const input = document.getElementById('input').value;
    fetchData(input);
  };



  return (
    <>
      <section className={`text-white flex flex-col h-[100vh] ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Partie Drap*/}
        <div className='flex justify-center content-center flex-wrap bg-slate-200 '>
          <div className='absolute t-0 l-0'>
            <img className='w-[100px]' />
          </div>
          <div className='flex mt-[15px] mb-[15px] border-[2px] h-[40px] rounded-xl '>
            <input id='input' className='text-black w-[360px] px-3 rounded-l-xl bg-white-100 border-r-2'></input>
            <button onClick={handleThemeSwitch} className='w-[96px] bg-[#222222]'>color</button>
            <button onClick={addVid} className='w-[96px] bg-[#222222] rounded-r-xl'>Add</button>
          </div>
        </div>




        {/* Partie Dezo*/}
        <div className='justify-left flex-[1] flex pt-[20px] px-[15px] flex-wrap gap-5 bg-[#121212] '>
        {vid.map((video) => (
          <Video thumbnail={video[1]} key={video[0]} url={video[0]} titre={video[2]}/>
        ))}
        </div>
      </section>
    </>
  );
}

export function Video({ thumbnail, titre, url }) {
  function downloadVideo(){
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: `https://www.youtube.com/watch?v=${url}` })
    };
    fetch('http://test.zaylab.com/download', options).then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'youtubedownloaderzay.mp4';
      link.click();
    })
    .catch(error => console.error(error));
  }
  return (
    <div className='h-[300px] w-[350px] mx-auto'>
      <a href={`https://www.youtube.com/watch?v=${url}`} target='_blank'>
      <img src={thumbnail} alt='Thumbnail' className='w-[350px]' />
      <div className='flex'>
      <div className='text-sm'>{titre}</div>
      <button onClick={downloadVideo} className='text-xs bg-green-800 px-4 rounded-r-[12px]'>Download</button>
      </div>
      </a>
    </div>
  );
}

export default App;