import gql from 'graphql-tag';

// tslint:disable-next-line: align
export const USER_FRAGMENT = gql`
    fragment UserObject on User {
        id
        name
        lastname
        email
        registerDate @include(if: $include)
        birthDay @include(if: $include)
        role
        active
        stripeCustomer
    }
`;
