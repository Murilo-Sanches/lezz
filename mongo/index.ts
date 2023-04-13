import client from "./o";

async function movie(title?: string) {
  try {
    const database = client.db("sample_films");
    const movies = database.collection("movies");
    await movies.insertOne({ title });
    const query = { title: "Back to the Future" };
    const movie = await movies.findOne(query);
    await database.dropDatabase();
    console.log(movie);
  } catch (err) {
    await client.close();
  }
}

// movie();
