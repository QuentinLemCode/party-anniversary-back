import {
  SpotifyTrackCategory,
  SpotifyURI,
} from '../external/spotify-api/types/spotify-interfaces';

export interface SpotifyOAuthDTO {
  code: string;
}

export interface Music {
  artist: string;
  title: string;
  album: string;
  uri: SpotifyURI<SpotifyTrackCategory>;
  cover: string;
}

export interface QueueMusic {
  uri: SpotifyURI<SpotifyTrackCategory>;
}
