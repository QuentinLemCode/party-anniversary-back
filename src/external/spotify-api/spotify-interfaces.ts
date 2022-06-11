export type SearchResults = {
  tracks: {
    href: string;
    items: Array<Track>;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
  };
  artists: {
    href: string;
    items: Array<Artist>;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
  };
  albums: {
    href: string;
    items: Array<Album>;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
  };
  playlists: {
    href: string;
    items: Array<unknown>;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
  };
  shows: {
    href: string;
    items: Array<unknown>;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
  };
  episodes: {
    href: string;
    items: Array<unknown>;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
  };
};

export type Track = {
  album: {
    album_type: string;
    total_tracks: number;
    available_markets: Array<string>;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions: {
      reason: string;
    };
    type: string;
    uri: string;
    album_group: string;
    artists: Array<{
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    }>;
  };
  artists: Array<{
    external_urls: {
      spotify: string;
    };
    followers: {
      href: string;
      total: number;
    };
    genres: Array<string>;
    href: string;
    id: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
    name: string;
    popularity: number;
    type: string;
    uri: string;
  }>;
  available_markets: Array<string>;
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
    ean: string;
    upc: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: {
    album: {
      album_type: string;
      total_tracks: number;
      available_markets: Array<string>;
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      images: Array<{
        url: string;
        height: number;
        width: number;
      }>;
      name: string;
      release_date: string;
      release_date_precision: string;
      restrictions: {
        reason: string;
      };
      type: string;
      uri: string;
      album_group: string;
      artists: Array<{
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
      }>;
    };
    artists: Array<{
      external_urls: {
        spotify: string;
      };
      followers: {
        href: string;
        total: number;
      };
      genres: Array<string>;
      href: string;
      id: string;
      images: Array<{
        url: string;
        height: number;
        width: number;
      }>;
      name: string;
      popularity: number;
      type: string;
      uri: string;
    }>;
    available_markets: Array<string>;
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
      isrc: string;
      ean: string;
      upc: string;
    };
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    is_playable: boolean;
    linked_from: {
      album: {
        album_type: string;
        total_tracks: number;
        available_markets: Array<string>;
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        images: Array<{
          url: string;
          height: number;
          width: number;
        }>;
        name: string;
        release_date: string;
        release_date_precision: string;
        restrictions: {
          reason: string;
        };
        type: string;
        uri: string;
        album_group: string;
        artists: Array<{
          external_urls: {
            spotify: string;
          };
          href: string;
          id: string;
          name: string;
          type: string;
          uri: string;
        }>;
      };
      artists: Array<{
        external_urls: {
          spotify: string;
        };
        followers: {
          href: string;
          total: number;
        };
        genres: Array<string>;
        href: string;
        id: string;
        images: Array<{
          url: string;
          height: number;
          width: number;
        }>;
        name: string;
        popularity: number;
        type: string;
        uri: string;
      }>;
      available_markets: Array<string>;
      disc_number: number;
      duration_ms: number;
      explicit: boolean;
      external_ids: {
        isrc: string;
        ean: string;
        upc: string;
      };
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      is_playable: boolean;
      linked_from: {
        album: {
          album_type: string;
          total_tracks: number;
          available_markets: Array<string>;
          external_urls: {
            spotify: string;
          };
          href: string;
          id: string;
          images: Array<{
            url: string;
            height: number;
            width: number;
          }>;
          name: string;
          release_date: string;
          release_date_precision: string;
          restrictions: {
            reason: string;
          };
          type: string;
          uri: string;
          album_group: string;
          artists: Array<{
            external_urls: {
              spotify: string;
            };
            href: string;
            id: string;
            name: string;
            type: string;
            uri: string;
          }>;
        };
        artists: Array<{
          external_urls: {
            spotify: string;
          };
          followers: {
            href: string;
            total: number;
          };
          genres: Array<string>;
          href: string;
          id: string;
          images: Array<{
            url: string;
            height: number;
            width: number;
          }>;
          name: string;
          popularity: number;
          type: string;
          uri: string;
        }>;
        available_markets: Array<string>;
        disc_number: number;
        duration_ms: number;
        explicit: boolean;
        external_ids: {
          isrc: string;
          ean: string;
          upc: string;
        };
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        is_playable: boolean;
        linked_from: {
          album: {
            album_type: string;
            total_tracks: number;
            available_markets: Array<string>;
            external_urls: {
              spotify: string;
            };
            href: string;
            id: string;
            images: Array<{
              url: string;
              height: number;
              width: number;
            }>;
            name: string;
            release_date: string;
            release_date_precision: string;
            restrictions: {
              reason: string;
            };
            type: string;
            uri: string;
            album_group: string;
            artists: Array<{
              external_urls: {
                spotify: string;
              };
              href: string;
              id: string;
              name: string;
              type: string;
              uri: string;
            }>;
          };
          artists: Array<{
            external_urls: {
              spotify: string;
            };
            followers: {
              href: string;
              total: number;
            };
            genres: Array<string>;
            href: string;
            id: string;
            images: Array<{
              url: string;
              height: number;
              width: number;
            }>;
            name: string;
            popularity: number;
            type: string;
            uri: string;
          }>;
          available_markets: Array<string>;
          disc_number: number;
          duration_ms: number;
          explicit: boolean;
          external_ids: {
            isrc: string;
            ean: string;
            upc: string;
          };
          external_urls: {
            spotify: string;
          };
          href: string;
          id: string;
          is_playable: boolean;
          linked_from: {
            album: {
              album_type: string;
              total_tracks: number;
              available_markets: Array<string>;
              external_urls: {
                spotify: string;
              };
              href: string;
              id: string;
              images: Array<{
                url: string;
                height: number;
                width: number;
              }>;
              name: string;
              release_date: string;
              release_date_precision: string;
              restrictions: {
                reason: string;
              };
              type: string;
              uri: string;
              album_group: string;
              artists: Array<{
                external_urls: {
                  spotify: string;
                };
                href: string;
                id: string;
                name: string;
                type: string;
                uri: string;
              }>;
            };
            artists: Array<{
              external_urls: {
                spotify: string;
              };
              followers: {
                href: string;
                total: number;
              };
              genres: Array<string>;
              href: string;
              id: string;
              images: Array<{
                url: string;
                height: number;
                width: number;
              }>;
              name: string;
              popularity: number;
              type: string;
              uri: string;
            }>;
            available_markets: Array<string>;
            disc_number: number;
            duration_ms: number;
            explicit: boolean;
            external_ids: {
              isrc: string;
              ean: string;
              upc: string;
            };
            external_urls: {
              spotify: string;
            };
            href: string;
            id: string;
            is_playable: boolean;
            linked_from: {
              album: {
                album_type: string;
                total_tracks: number;
                available_markets: Array<string>;
                external_urls: {
                  spotify: string;
                };
                href: string;
                id: string;
                images: Array<{
                  url: string;
                  height: number;
                  width: number;
                }>;
                name: string;
                release_date: string;
                release_date_precision: string;
                restrictions: {
                  reason: string;
                };
                type: string;
                uri: string;
                album_group: string;
                artists: Array<{
                  external_urls: {
                    spotify: string;
                  };
                  href: string;
                  id: string;
                  name: string;
                  type: string;
                  uri: string;
                }>;
              };
              artists: Array<{
                external_urls: {
                  spotify: string;
                };
                followers: {
                  href: string;
                  total: number;
                };
                genres: Array<string>;
                href: string;
                id: string;
                images: Array<{
                  url: string;
                  height: number;
                  width: number;
                }>;
                name: string;
                popularity: number;
                type: string;
                uri: string;
              }>;
              available_markets: Array<string>;
              disc_number: number;
              duration_ms: number;
              explicit: boolean;
              external_ids: {
                isrc: string;
                ean: string;
                upc: string;
              };
              external_urls: {
                spotify: string;
              };
              href: string;
              id: string;
              is_playable: boolean;
              linked_from: {
                album: {
                  album_type: string;
                  total_tracks: number;
                  available_markets: Array<string>;
                  external_urls: {
                    spotify: string;
                  };
                  href: string;
                  id: string;
                  images: Array<{
                    url: string;
                    height: number;
                    width: number;
                  }>;
                  name: string;
                  release_date: string;
                  release_date_precision: string;
                  restrictions: {
                    reason: string;
                  };
                  type: string;
                  uri: string;
                  album_group: string;
                  artists: Array<{
                    external_urls: {
                      spotify: string;
                    };
                    href: string;
                    id: string;
                    name: string;
                    type: string;
                    uri: string;
                  }>;
                };
                artists: Array<{
                  external_urls: {
                    spotify: string;
                  };
                  followers: {
                    href: string;
                    total: number;
                  };
                  genres: Array<string>;
                  href: string;
                  id: string;
                  images: Array<{
                    url: string;
                    height: number;
                    width: number;
                  }>;
                  name: string;
                  popularity: number;
                  type: string;
                  uri: string;
                }>;
                available_markets: Array<string>;
                disc_number: number;
                duration_ms: number;
                explicit: boolean;
                external_ids: {
                  isrc: string;
                  ean: string;
                  upc: string;
                };
                external_urls: {
                  spotify: string;
                };
                href: string;
                id: string;
                is_playable: boolean;
                linked_from: {
                  album: {
                    album_type: string;
                    total_tracks: number;
                    available_markets: Array<string>;
                    external_urls: {
                      spotify: string;
                    };
                    href: string;
                    id: string;
                    images: Array<{
                      url: string;
                      height: number;
                      width: number;
                    }>;
                    name: string;
                    release_date: string;
                    release_date_precision: string;
                    restrictions: {
                      reason: string;
                    };
                    type: string;
                    uri: string;
                    album_group: string;
                    artists: Array<{
                      external_urls: {
                        spotify: string;
                      };
                      href: string;
                      id: string;
                      name: string;
                      type: string;
                      uri: string;
                    }>;
                  };
                  artists: Array<{
                    external_urls: {
                      spotify: string;
                    };
                    followers: {
                      href: string;
                      total: number;
                    };
                    genres: Array<string>;
                    href: string;
                    id: string;
                    images: Array<{
                      url: string;
                      height: number;
                      width: number;
                    }>;
                    name: string;
                    popularity: number;
                    type: string;
                    uri: string;
                  }>;
                  available_markets: Array<string>;
                  disc_number: number;
                  duration_ms: number;
                  explicit: boolean;
                  external_ids: {
                    isrc: string;
                    ean: string;
                    upc: string;
                  };
                  external_urls: {
                    spotify: string;
                  };
                  href: string;
                  id: string;
                  is_playable: boolean;
                  linked_from: {
                    album: {
                      album_type: string;
                      total_tracks: number;
                      available_markets: Array<string>;
                      external_urls: {
                        spotify: string;
                      };
                      href: string;
                      id: string;
                      images: Array<{
                        url: string;
                        height: number;
                        width: number;
                      }>;
                      name: string;
                      release_date: string;
                      release_date_precision: string;
                      restrictions: {
                        reason: string;
                      };
                      type: string;
                      uri: string;
                      album_group: string;
                      artists: Array<{
                        external_urls: {
                          spotify: string;
                        };
                        href: string;
                        id: string;
                        name: string;
                        type: string;
                        uri: string;
                      }>;
                    };
                    artists: Array<{
                      external_urls: {
                        spotify: string;
                      };
                      followers: {
                        href: string;
                        total: number;
                      };
                      genres: Array<string>;
                      href: string;
                      id: string;
                      images: Array<{
                        url: string;
                        height: number;
                        width: number;
                      }>;
                      name: string;
                      popularity: number;
                      type: string;
                      uri: string;
                    }>;
                    available_markets: Array<string>;
                    disc_number: number;
                    duration_ms: number;
                    explicit: boolean;
                    external_ids: {
                      isrc: string;
                      ean: string;
                      upc: string;
                    };
                    external_urls: {
                      spotify: string;
                    };
                    href: string;
                    id: string;
                    is_playable: boolean;
                    linked_from: {
                      album: {
                        album_type: string;
                        total_tracks: number;
                        available_markets: Array<string>;
                        external_urls: {
                          spotify: string;
                        };
                        href: string;
                        id: string;
                        images: Array<{
                          url: string;
                          height: number;
                          width: number;
                        }>;
                        name: string;
                        release_date: string;
                        release_date_precision: string;
                        restrictions: {
                          reason: string;
                        };
                        type: string;
                        uri: string;
                        album_group: string;
                        artists: Array<{
                          external_urls: unknown;
                          href: string;
                          id: string;
                          name: string;
                          type: string;
                          uri: string;
                        }>;
                      };
                      artists: Array<{
                        external_urls: {
                          spotify: string;
                        };
                        followers: {
                          href: string;
                          total: number;
                        };
                        genres: Array<string>;
                        href: string;
                        id: string;
                        images: Array<unknown>;
                        name: string;
                        popularity: number;
                        type: string;
                        uri: string;
                      }>;
                      available_markets: Array<string>;
                      disc_number: number;
                      duration_ms: number;
                      explicit: boolean;
                      external_ids: {
                        isrc: string;
                        ean: string;
                        upc: string;
                      };
                      external_urls: {
                        spotify: string;
                      };
                      href: string;
                      id: string;
                      is_playable: boolean;
                      linked_from: {
                        album: {
                          album_type: string;
                          total_tracks: number;
                          available_markets: Array<string>;
                          external_urls: {
                            spotify: string;
                          };
                          href: string;
                          id: string;
                          images: Array<unknown>;
                          name: string;
                          release_date: string;
                          release_date_precision: string;
                          restrictions: {
                            reason: string;
                          };
                          type: string;
                          uri: string;
                          album_group: string;
                          artists: Array<Artist>;
                        };
                        artists: Array<{
                          external_urls: unknown;
                          followers: unknown;
                          genres: Array<string>;
                          href: string;
                          id: string;
                          images: Array<unknown>;
                          name: string;
                          popularity: number;
                          type: string;
                          uri: string;
                        }>;
                        available_markets: Array<string>;
                        disc_number: number;
                        duration_ms: number;
                        explicit: boolean;
                        external_ids: {
                          isrc: string;
                          ean: string;
                          upc: string;
                        };
                        external_urls: {
                          spotify: string;
                        };
                        href: string;
                        id: string;
                        is_playable: boolean;
                        linked_from: {
                          album: {
                            album_type: string;
                            total_tracks: number;
                            available_markets: Array<string>;
                            external_urls: unknown;
                            href: string;
                            id: string;
                            images: Array<unknown>;
                            name: string;
                            release_date: string;
                            release_date_precision: string;
                            restrictions: unknown;
                            type: string;
                            uri: string;
                            album_group: string;
                            artists: Array<unknown>;
                          };
                          artists: Array<{
                            genres: Array<any>;
                            images: Array<any>;
                          }>;
                          available_markets: Array<string>;
                          disc_number: number;
                          duration_ms: number;
                          explicit: boolean;
                          external_ids: {
                            isrc: string;
                            ean: string;
                            upc: string;
                          };
                          external_urls: {
                            spotify: string;
                          };
                          href: string;
                          id: string;
                          is_playable: boolean;
                          linked_from: {
                            album: {
                              available_markets: Array<any>;
                              images: Array<any>;
                              artists: Array<any>;
                            };
                            artists: Array<unknown>;
                            available_markets: Array<any>;
                            disc_number: number;
                            duration_ms: number;
                            explicit: boolean;
                            external_ids: unknown;
                            external_urls: unknown;
                            href: string;
                            id: string;
                            is_playable: boolean;
                            linked_from: {
                              artists: Array<any>;
                              available_markets: Array<any>;
                            };
                            restrictions: unknown;
                            name: string;
                            popularity: number;
                            preview_url: string;
                            track_number: number;
                            type: string;
                            uri: string;
                            is_local: boolean;
                          };
                          restrictions: {
                            reason: string;
                          };
                          name: string;
                          popularity: number;
                          preview_url: string;
                          track_number: number;
                          type: string;
                          uri: string;
                          is_local: boolean;
                        };
                        restrictions: {
                          reason: string;
                        };
                        name: string;
                        popularity: number;
                        preview_url: string;
                        track_number: number;
                        type: string;
                        uri: string;
                        is_local: boolean;
                      };
                      restrictions: {
                        reason: string;
                      };
                      name: string;
                      popularity: number;
                      preview_url: string;
                      track_number: number;
                      type: string;
                      uri: string;
                      is_local: boolean;
                    };
                    restrictions: {
                      reason: string;
                    };
                    name: string;
                    popularity: number;
                    preview_url: string;
                    track_number: number;
                    type: string;
                    uri: string;
                    is_local: boolean;
                  };
                  restrictions: {
                    reason: string;
                  };
                  name: string;
                  popularity: number;
                  preview_url: string;
                  track_number: number;
                  type: string;
                  uri: string;
                  is_local: boolean;
                };
                restrictions: {
                  reason: string;
                };
                name: string;
                popularity: number;
                preview_url: string;
                track_number: number;
                type: string;
                uri: string;
                is_local: boolean;
              };
              restrictions: {
                reason: string;
              };
              name: string;
              popularity: number;
              preview_url: string;
              track_number: number;
              type: string;
              uri: string;
              is_local: boolean;
            };
            restrictions: {
              reason: string;
            };
            name: string;
            popularity: number;
            preview_url: string;
            track_number: number;
            type: string;
            uri: string;
            is_local: boolean;
          };
          restrictions: {
            reason: string;
          };
          name: string;
          popularity: number;
          preview_url: string;
          track_number: number;
          type: string;
          uri: string;
          is_local: boolean;
        };
        restrictions: {
          reason: string;
        };
        name: string;
        popularity: number;
        preview_url: string;
        track_number: number;
        type: string;
        uri: string;
        is_local: boolean;
      };
      restrictions: {
        reason: string;
      };
      name: string;
      popularity: number;
      preview_url: string;
      track_number: number;
      type: string;
      uri: string;
      is_local: boolean;
    };
    restrictions: {
      reason: string;
    };
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;
  };
  restrictions: {
    reason: string;
  };
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
};

export type Artist = {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  genres: Array<string>;
  href: string;
  id: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  name: string;
  popularity: number;
  type: string;
  uri: string;
};

export type Album = {
  album_type: string;
  total_tracks: number;
  available_markets: Array<string>;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions: {
    reason: string;
  };
  type: string;
  uri: string;
  artists: Array<{
    external_urls: {
      spotify: string;
    };
    followers: {
      href: string;
      total: number;
    };
    genres: Array<string>;
    href: string;
    id: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
    name: string;
    popularity: number;
    type: string;
    uri: string;
  }>;
  tracks: {
    href: string;
    items: Array<Track>;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
  };
};

export type PlaybackStatus = {
  device: {
    id: string;
    is_active: boolean;
    is_private_session: boolean;
    is_restricted: boolean;
    name: string;
    type: string;
    volume_percent: number;
  };
  shuffle_state: boolean;
  repeat_state: string;
  timestamp: number;
  context: any;
  progress_ms: number;
  item: {
    album: {
      album_type: string;
      artists: Array<{
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
      }>;
      available_markets: Array<string>;
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      images: Array<{
        height: number;
        url: string;
        width: number;
      }>;
      name: string;
      release_date: string;
      release_date_precision: string;
      total_tracks: number;
      type: string;
      uri: string;
    };
    artists: Array<{
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: string;
      uri: string;
    }>;
    available_markets: Array<string>;
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
      isrc: string;
    };
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    is_local: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
  };
  currently_playing_type: string;
  actions: {
    disallows: {
      resuming: boolean;
      toggling_repeat_context: boolean;
      toggling_repeat_track: boolean;
      toggling_shuffle: boolean;
    };
  };
  is_playing: boolean;
};
