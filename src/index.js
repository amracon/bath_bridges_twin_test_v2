import {
  Viewer,
  Cartesian3,
  Cartesian2,
  HeightReference,
  HorizontalOrigin,
  VerticalOrigin,
  NearFarScalar,
  Math as CesiumMath,
  Terrain,
  createOsmBuildingsAsync,
  Color,
  ScreenSpaceEventType,
  HeadingPitchRoll,
  Transforms,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./css/main.css";
import { bridges } from "./data/bridges";
import { assets } from "./data/assets";
import blue_marker from "./icons/blue_marker.png";

// Importa las fotografías de los puentes desde el directorio PycharmProjects/bath_bridges_twin_test_v2/src/data/photos
import pulteneyPhoto from "./data/photos/pulteney01.jpg";
import victoriaPhoto from "./data/photos/victoria01.jpg";
import midlandPhoto from "./data/photos/midland01.jpg";
import clevelandPhoto from "./data/photos/cleveland01.jpg";
import abbeydoorPhoto from "./data/photos/abbeydoor01.jpg";

//CREO LA CONSTANTE DE LAS FOTOS DE LOS PUENTES
const bridgePhotos = {

  pulteney: pulteneyPhoto,
    midland: midlandPhoto,
  victoria: victoriaPhoto,
  cleveland: clevelandPhoto,
};

//CREO LA CONSTANTE DE LAS FOTOS DE LOS ASSETS
const assetPhotos = {

    abbeydoor: abbeydoorPhoto

};

// CesiumJS has a default access token built in but it's not meant for active use.
// please set your own access token can be found at: https://cesium.com/ion/tokens.
// Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjRVYnIzSDduRnpJdzZEX2EiLCJqdGkiOiJmNjAxZTZkZC04ODQ1LTRhODgtYjQ0OC04MjczYWJmN2M0ODAiLCJpZCI6NDY5MzY4LCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3ODcwNzI1Mjh9.fHQ5fWDBy1SsqANzIdwoF8m3TAE2Jmg1yZG4b0yhd2I';

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Viewer("cesiumContainer", {
  terrain: Terrain.fromWorldTerrain(),
  infoBox: true,
});

// Add Cesium OSM Buildings, a global 3D buildings layer.
const osmBuildingsTileset = await createOsmBuildingsAsync();
viewer.scene.primitives.add(osmBuildingsTileset);

// Fly the camera to Bath, UK at the given longitude, latitude, and height.
viewer.camera.flyTo({
  destination: Cartesian3.fromDegrees(
    -2.359,
    51.381,
    3500
  ),
});

// Lista de entidades 3D
const assetEntities = [];

// Assets 3D
for (const asset of assets) {

  const position = Cartesian3.fromDegrees(
    asset.lon,
    asset.lat,
    asset.height
  );

  const orientation =
    Transforms.headingPitchRollQuaternion(
      position,
      new HeadingPitchRoll(
        CesiumMath.toRadians(asset.heading),
        0,
        0
      )
    );

  const assetEntity = viewer.entities.add({

    name: asset.name,
    position: position,
    orientation: orientation,

model: {
    uri: asset.uri,
    scale: asset.scale
},

description: `

<img
    src="${assetPhotos[asset.id]}"
    class="bridgePhoto"
>
<h2>${asset.name}</h2>

<table class="cesium-infoBox-defaultTable">

<tr>
  <th>Type</th>
  <td>${asset.type}</td>
</tr>

<tr>
  <th>Date</th>
  <td>${asset.constructionDate}</td>
</tr>

<tr>
  <th>3D Model</th>
  <td>
    ${asset.model3D}
      Open 3D Model
    </a>
  </td>
</tr>

<tr>
  <th>More Info</th>
  <td>
    <a href="${asset.moreInfo}"ore Info
    </a>
  </td>
</tr>

</table>

<p>${asset.description}</p>

`,

    properties: {
      type: asset.type,
      constructionDate: asset.constructionDate,
      photo: asset.photo,
      model3D: asset.model3D,
      moreInfo: asset.moreInfo,
      description: asset.description
}
  });

  assetEntities.push(assetEntity);
}

assetsCheckbox.addEventListener(
  "change",
  function() {

    assetEntities.forEach(entity => {

      entity.show =
        assetsCheckbox.checked;

    });

  }
);

// Esto es el panel HTML cada vez que clicas un puente
  const panel =
    document.getElementById("bridgePanel");

const content =
    document.getElementById("bridgeContent");
viewer.screenSpaceEventHandler.setInputAction(
  function(click) {

    const pickedObject =
        viewer.scene.pick(click.position);

    if (!pickedObject) return;

    const entity = pickedObject.id;

    if (!entity) return;

    panel.style.display = "block";


    content.innerHTML =
    entity.description?.getValue
      ? entity.description.getValue()
      : entity.description;
  },
  ScreenSpaceEventType.LEFT_CLICK
);

document.getElementById("closePanel")
.addEventListener("click", function() {

    panel.style.display = "none";

});

// Style of bridges points and labels
for (const bridge of bridges) {
  viewer.entities.add({
    name: bridge.name,
    position: Cartesian3.fromDegrees(
        bridge.lon,
        bridge.lat,
        0 // elevamos el punto sobre el terreno
    ),

    billboard: {
    image: blue_marker,
    scale: 0.03,
    verticalOrigin: VerticalOrigin.BOTTOM,
    heightReference: HeightReference.CLAMP_TO_GROUND,
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
    scaleByDistance: new NearFarScalar(
        150,
        1.5,
        15000000,
        0.5
    )
},

    label: {
      text: bridge.name,
      font: "12px Arial",
      fillColor: Color.BLACK,
      backgroundColor: Color.WHITE.withAlpha(0.85),
      showBackground: true,
      horizontalOrigin: HorizontalOrigin.CENTER,
      verticalOrigin: VerticalOrigin.BOTTOM,
      heightReference: HeightReference.CLAMP_TO_GROUND,
      pixelOffset: new Cartesian2(0, -50),
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },

    // Table showing every bridge attributes:
    description: `

<img
    src="${bridgePhotos[bridge.id]}"
    class="bridgePhoto"
>
<h2>${bridge.name}</h2>

<table class="cesium-infoBox-defaultTable">

<tr>
  <th>Construction</th>
  <td>${bridge.constructionDate}</td>
</tr>

<tr>
  <th>Architect</th>
  <td>${bridge.architect}</td>
</tr>

<tr>
  <th>Type</th>
  <td>${bridge.bridgeType}</td>
</tr>

<tr>
  <th>Material</th>
  <td>${bridge.material}</td>
</tr>

<tr>
  <th>Heritage Status</th>
  <td>${bridge.heritageStatus}</td>
</tr>

<tr>
  <th>3D Model</th>
  <td>
    ${bridge.model3D}
    </a>
  </td>
</tr>

<tr>
  <th>More Info</th>
  <td>
    <a href="${bridge.moreInfo}"
e Information
    </a>
  </td>
</tr>

</table>

<p>${bridge.description}</p>

`
  });

}