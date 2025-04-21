export type IUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  username: string;
  address: {
    city: string;
    geo: {
      lat: string;
      lng: string;
    };
    suite: string;
    street: string;
    zipcode: string;
  };
  company: {
    bs: string;
    name: string;
    catchPhrase: string;
  };
};
