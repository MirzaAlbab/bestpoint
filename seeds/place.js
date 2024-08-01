const mongoose = require("mongoose");
const Place = require("../models/place");
const { geometry } = require("../utils/hereMaps");

mongoose
  .connect("mongodb://127.0.0.1/bestpoints")
  .then((result) => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

async function seedPlaces() {
  const places = [
    {
      title: "Pulau Komodo",
      price: 5000000,
      description:
        "Pulau di Indonesia yang terkenal dengan komodo, hewan terbesar di dunia",
      location: "Pulau Komodo, East Nusa Tenggara",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Taman Nasional Gunung Rinjani",
      price: 150000,
      description:
        "Taman nasional yang terletak di Lombok dan memiliki gunung tertinggi kedua di Indonesia",
      location: "Taman Nasional Gunung Rinjani, Lombok, West Nusa Tenggara",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Bukit Tinggi",
      price: 0,
      description:
        "Kota kecil yang terletak di Sumatera Barat dengan arsitektur khas Eropa",
      location: "Bukit Tinggi, West Sumatra",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Pulau Weh",
      price: 0,
      description:
        "Pulau yang terletak di ujung barat Indonesia dengan keindahan bawah laut yang luar biasa",
      location: "Pulau Weh, Sabang, Aceh",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Pulau Lombok",
      price: 0,
      description:
        "Pulau di Indonesia yang terkenal dengan keindahan pantainya",
      location: "Pulau Lombok, West Nusa Tenggara",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Tanjung Lesung",
      price: 100000,
      description:
        "Kawasan wisata pantai di Banten yang cocok untuk bersantai dan berenang",
      location: "Tanjung Lesung, Pandeglang, Banten",
      image: "https://source.unsplash.com/collection/2349781/1280x720",
    },
  ];

  try {
    const newPlace = await Promise.all(
      places.map(async (place) => {
        let geoData = await geometry(place.location);
        if (!geoData) {
          geoData = { type: "Point", coordinates: [116.32883, -8.90952] };
        }
        return {
          ...place,
          author: "66a8e92964e1a7f7bf30bcdb",
          geometry: geoData,
        };
      })
    );
    await Place.deleteMany();
    await Place.insertMany(newPlace);
    console.log("Data berhasil disimpan");
  } catch (err) {
    console.log("Terjadi kesalahan saat menyimpan data:", err);
  } finally {
    mongoose.disconnect();
  }
}

seedPlaces();
