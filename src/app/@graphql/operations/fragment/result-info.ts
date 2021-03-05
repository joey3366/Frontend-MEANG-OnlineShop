import gql from 'graphql-tag';

// tslint:disable-next-line: align
export const RESULT_INFO_FRAGMENT = gql`
    fragment ResultInfoObject on ResultInfo {
        page
        pages
        total
        itemsPage
    }
`;
