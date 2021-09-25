import gql from "graphql-tag";

export const GET_SCHEDULES = gql`
  query getSchedule() {
    schedules() {
      id
      title
      time
      shipping_charage
    }
  }
`;
