const url = "https://foodiefetch.p.rapidapi.com/swiggy";
const query = "nashik";

const headers = new Headers({
  "X-RapidAPI-Key": "8c5ff13c37mshb909e06c41ecff8p1985b2jsnb5b2273cda55",
  "X-RapidAPI-Host": "foodiefetch.p.rapidapi.com",
});

const options = {
  method: "GET",
  headers: headers,
};

export const getAPICall = async () => {
  // Append query parameter to the URL
  const apiUrl = new URL(url);
  apiUrl.searchParams.append("query", query);

  try {
    const response = await fetch(apiUrl, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
