import gql from 'graphql-tag';
import { GENRE_FRAGMENT } from '../fragment/genre';

export const ADD_GENRE = gql`
  mutation insertarGenero($genre: String!) {
        addGenre(genre: $genre) {
            status
            message
            genre {
                ...GenreObject
            }
        }
    }
    ${GENRE_FRAGMENT}
`;

export const MODIFY_GENRE = gql`
  mutation actualizarGenero($id: ID!, $genre: String!) {
        updateGenre(id: $id, genre: $genre){
            status
            message
            genre {
                ...GenreObject
            }
        }
    }
    ${GENRE_FRAGMENT}
`;

export const BLOCK_GENRE = gql`
  mutation BloquearGenero($id: ID!, $unblock: Boolean) {
        blockGenre(id: $id, unblock: $unblock){
            status
            message
        }
    }
`;