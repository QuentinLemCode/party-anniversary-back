import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { env } from 'process';
import { first, map, mergeMap, Observable, of, tap } from 'rxjs';
import { SearchResults } from './spotify-interfaces';
import { Token, TokenWithCalculatedExpiration } from './token';

@Injectable()
export class SpotifyApiService implements OnModuleInit {
  constructor(private http: HttpService) {}
  private currentToken: TokenWithCalculatedExpiration;

  onModuleInit() {
    this.loadToken().subscribe();
  }

  search(query: string): Observable<AxiosResponse<SearchResults>> {
    return this.key.pipe(
      first(),
      mergeMap((key) => {
        return this.http.get('https://api.spotify.com/v1/search', {
          params: {
            q: query,
            type: 'track,artist',
            limit: 20,
            market: 'FR',
          },
          headers: {
            Authorization: 'Bearer ' + key,
          },
        });
      }),
    );
  }

  getToken(): Observable<AxiosResponse<Token>> {
    return this.http.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(
              env.SPOTIFY_CLIENT_ID + ':' + env.SPOTIFY_CLIENT_KEY,
            ).toString('base64'),
        },
      },
    );
  }

  private loadToken(): Observable<Token> {
    return this.getToken().pipe(
      map((response) => response.data),
      tap((token) => this.saveToken(token)),
    );
  }

  private saveToken(token: Token) {
    this.currentToken = {
      ...token,
      expiryDate: new Date(new Date().getTime() + token.expires_in * 1000),
    };
  }

  private get key(): Observable<string> {
    if (this.currentToken?.expiryDate <= new Date()) {
      return of(this.currentToken.access_token);
    }
    return this.loadToken().pipe(map((token) => token.access_token));
  }
}
