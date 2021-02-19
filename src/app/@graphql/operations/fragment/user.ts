import gql from 'graphql-tag';

// tslint:disable-next-line: align
export const USER_FRAGMENT = gql`
    fragment UserObject on User {
        id
        name
        lastname
        email
        password @include(if: $include)
        registerDate @include(if: $include)
        birthDay @include(if: $include)
        role
    }
`;
