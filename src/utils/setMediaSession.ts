import { getCoverArtUrl } from '@/api/httpClient'
import { ISong } from '@/types/responses/song'

const artworkSizes = ['96', '128', '192', '256', '384', '512']

function removeMediaSession() {
  if (!navigator.mediaSession) return

  navigator.mediaSession.metadata = null
}

function setMediaSession(song: ISong) {
  if (!navigator.mediaSession) return

  navigator.mediaSession.metadata = new MediaMetadata({
    title: song.title,
    artist: song.artist,
    album: song.album,
    artwork: artworkSizes.map((size): MediaImage => {
      return {
        src: getCoverArtUrl(song.coverArt, 'song', size),
        sizes: [size, size].join('x'),
        type: 'image/jpeg',
      }
    }),
  })
}

async function setRadioMediaSession(label: string, radioName: string) {
  if (!navigator.mediaSession) return

  navigator.mediaSession.metadata = new MediaMetadata({
    title: radioName,
    artist: label,
    album: '',
    artwork: [
      {
        src: '',
        sizes: '',
        type: '',
      },
    ],
  })
}

function setPlaybackState(state: boolean | null) {
  if (!navigator.mediaSession) return

  if (state === null) navigator.mediaSession.playbackState = 'none'

  if (state) {
    navigator.mediaSession.playbackState = 'playing'
  } else {
    navigator.mediaSession.playbackState = 'paused'
  }
}

interface SetHandlerParams {
  setProgress: (n: number) => void
  togglePlayPause: () => void
  playPrev: () => void
  playNext: () => void
  audioRef: HTMLAudioElement | null
}

function setHandlers({
  setProgress,
  playPrev,
  playNext,
  audioRef,
}: SetHandlerParams) {
  if (!navigator.mediaSession) return

  navigator.mediaSession.setActionHandler('previoustrack', () => playPrev())
  navigator.mediaSession.setActionHandler('nexttrack', () => playNext())
  navigator.mediaSession.setActionHandler('seekto', (progress) => {
    if (progress.seekTime === undefined) {
      return
    }
    if (audioRef) {
      const time = Math.floor(progress.seekTime)
      setProgress(time)
      audioRef.currentTime = time
    }
  })
}

export const manageMediaSession = {
  removeMediaSession,
  setMediaSession,
  setRadioMediaSession,
  setPlaybackState,
  setHandlers,
}
