import { useEffect, useRef, useState } from 'react'

function srtToVtt(srtText){
  if (!srtText) return ''
  const lines = srtText.split(/\r?\n/)
  const cleaned = []
  for (let i = 0; i < lines.length; i++){
    const line = lines[i].trim()
    // drop numeric index lines
    if (/^\d+$/.test(line)) continue
    cleaned.push(line)
  }
  const body = cleaned.join('\n').replace(/,(\d{3})/g, '.$1')
  return `WEBVTT\n\n${body}`
}

export default function VideoPlayer({ src, subtitleSrc, title, onClose, onPlayed }){
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [rate, setRate] = useState(1)
  const [muted, setMuted] = useState(false)
  const [trackUrl, setTrackUrl] = useState('')
  const [trackError, setTrackError] = useState('')

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onCanPlay = () => setReady(true)
    let playedOnce = false
    const onPlay = () => {
      setPlaying(true)
      if (!playedOnce) {
        playedOnce = true
        if (typeof onPlayed === 'function') {
          try { onPlayed() } catch (_) {}
        }
      }
    }
    const onPause = () => setPlaying(false)
    v.addEventListener('canplay', onCanPlay)
    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    return () => {
      v.removeEventListener('canplay', onCanPlay)
      v.removeEventListener('play', onPlay)
      v.removeEventListener('pause', onPause)
    }
  }, [src])

  useEffect(() => {
    setTrackUrl('')
    setTrackError('')
    let revoke = null
    async function loadSrt(){
      try {
        if (!subtitleSrc) return
        const res = await fetch(subtitleSrc, { cache: 'no-cache' })
        if (!res.ok) return
        const srt = await res.text()
        const vtt = srtToVtt(srt)
        const blob = new Blob([vtt], { type: 'text/vtt' })
        const url = URL.createObjectURL(blob)
        setTrackUrl(url)
        revoke = url
      } catch (e) {
        setTrackError('Failed to load subtitles')
      }
    }
    loadSrt()
    return () => { if (revoke) URL.revokeObjectURL(revoke) }
  }, [subtitleSrc])

  const setSpeed = (r) => {
    setRate(r)
    if (videoRef.current) videoRef.current.playbackRate = r
  }
  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) v.play().catch(()=>{})
    else v.pause()
  }
  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'grid',placeItems:'center',zIndex:1000}}>
      <div style={{background:'#111',borderRadius:12,overflow:'hidden',width:'min(900px, 92vw)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 12px',color:'#fff',background:'#1a1a1a'}}>
          <div style={{fontWeight:600}}>{title || 'Video Player'}</div>
          <button onClick={onClose} style={{background:'transparent',border:'1px solid #444',color:'#fff',padding:'6px 10px',borderRadius:6,cursor:'pointer'}}>Close</button>
        </div>
        <div style={{padding:12}}>
          <video
            ref={videoRef}
            src={src}
            controls
            style={{width:'100%',borderRadius:8,background:'#000'}}
          >
            {trackUrl && (
              <track src={trackUrl} kind="subtitles" label="Subtitles" default />
            )}
          </video>

          <div style={{display:'flex',alignItems:'center',gap:8,color:'#ddd',marginTop:10}}>
            <button onClick={togglePlay} style={{background:'#2a2a2a',border:'none',color:'#fff',padding:'6px 10px',borderRadius:6,cursor:'pointer'}}>
              {playing ? 'Pause' : (ready ? 'Play' : 'Loading…')}
            </button>
            <button onClick={toggleMute} style={{background:'#2a2a2a',border:'none',color:'#fff',padding:'6px 10px',borderRadius:6,cursor:'pointer'}}>
              {muted ? 'Unmute' : 'Mute'}
            </button>
            <span style={{marginLeft:8}}>Speed:</span>
            {[1, 1.5, 2, 4].map(r => (
              <button key={r} onClick={()=>setSpeed(r)} style={{background: rate===r ? '#4a90e2':'#2a2a2a',border:'none',color:'#fff',padding:'6px 10px',borderRadius:6,cursor:'pointer'}}>{r}x</button>
            ))}
            {trackError && <span style={{color:'crimson',marginLeft:'auto'}}>{trackError}</span>}
            <a href={src} target="_blank" rel="noopener noreferrer" style={{marginLeft:'auto',color:'#9fd1ff'}}>Open in new tab</a>
          </div>
        </div>
      </div>
    </div>
  )
}
