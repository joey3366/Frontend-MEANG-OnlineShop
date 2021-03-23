import gql from 'graphql-tag';
import { USER_FRAGMENT } from '../fragment/user';
import { RESULT_INFO_FRAGMENT } from './../fragment/result-info';

export const LOGIN_QUERY = gql`
    query getLogin($email: String!, $password: String!, $include: Boolean!){
        login(email: $email, password: $password) {
            status
            message
            token
            user{
                ...UserObject
            }
        }
    }
    ${ USER_FRAGMENT }
`;

export const USERS_LIST_QUERY = gql`
    query usersList($include: Boolean!, $page: Int, $itemsPage: Int, $active: ActiveFilterEnum){
        users(page: $page, itemsPage: $itemsPage, active: $active){
            status
            message
            users{
                ...UserObject
            }
            info{
                ...ResultInfoObject
            }
        }
    }
    ${ USER_FRAGMENT },
    ${ RESULT_INFO_FRAGMENT}
`;

export const ME_DATA_QUERY = gql`
    query meData($include: Boolean!){
        me{
            status
            message
            user{
                ...UserObject
            }
            }
        }
    ${ USER_FRAGMENT }
`;
