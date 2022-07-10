//main app greenCity
//declaration of WebScene, widgets
define ([
    "dojo/_base/declare",

    "esri/views/SceneView",
    "esri/WebScene",
    "esri/layers/SceneLayer",
    "esri/layers/FeatureLayer",

    "esri/widgets/Search",
    "esri/widgets/Zoom",
    "esri/widgets/BasemapToggle",
    "esri/widgets/Daylight",
    "esri/widgets/Legend",
    "esri/widgets/Home",
    "esri/PopupTemplate",
    "esri/popup/content/MediaContent",
    "esri/popup/content/PieChartMediaInfo",
    "esri/tasks/support/Query",
    "esri/widgets/Slider"




], function( declare,
    SceneView, WebScene, SceneLayer, FeatureLayer,
    Search, Zoom,BasemapToggle,Daylight, Legend, Home,
    PopupTemplate,
    MediaContent, PieChartMediaInfo,
    Query, Slider


)  {
    return declare (null,{

        constructor: function () {
        },


        init: function () {
                var portalItemSceneId = "e7701c26b07a4cc5a45d24037a5499bd"; //SceneLayer
                var portalItem = "41ba5f5db5fe41be814fbe079276218f"; //WebScene
                var url = "https://services2.arcgis.com/MzCtPDSne0rpIt7V/arcgis/rest/services/Bron2_3D/FeatureServer/0";

                //defining WebScene
                var scene = new WebScene({
                  portalItem: {
                    id: portalItem
                  },
                    qualityProfile: "high"
                });
                //defining SceneView
                var view = new SceneView({
                  container: "viewDiv", // Reference to the scene div below
                  map: scene, // Reference to the map object created before the scene

                });
//                view.popup = null;
//                view.popup.autoOpenEnabled = true; //off click event
//                environment settings for better visuals (shadows)
                view.environment.lighting.directShadowsEnabled = true;


//                check if scene is loaded
                scene.load()
                  .then(function() {
                    view.scene = WebScene,
                    console.log("loaded");
                   })
                  .catch(function(error) {
                    console.error("The resource failed to load: ", error);
                  });




//                if is loaded ---> create popup and renderers
// --------------------------------P O P U P S --------------------------------

                var popupTemplate2 = {
                title: "Powierzchnia dachu w zależności od nachylenia",
                content: [
                {
                    type: "fields",
                      fieldInfos: [
                        {
                          fieldName: "area_sl0_5",
                          label: "Nachylenie dachu od 0 do 5 st",
                          format: {
                            digitSeparator: true,
                            places: 2
                          }
                        },
                        {
                          fieldName: "area_sl5_1",
                          label: "Nachylenie dachu od 5 do 10 stopni",
                          format: {
                            digitSeparator: true,
                            places: 2
                          }
                        },
                        {
                          fieldName: "area_sl10_",
                          label: "Nachylenie dachu od 10 do 15 stopni",
                          format: {
                            digitSeparator: true,
                            places: 2
                          }
                        },
                        {
                          fieldName: "area_sl15_", // <---
                          label: "Nachylenie dachu od 15 do 35 stopni",
                          format: {
                            digitSeparator: true,
                            places: 2
                          }
                        },
                        {
                          fieldName: "area_sl_35", // <---
                          label: "Nachylenie powyżej 35 stopni",
                          format: {
                            digitSeparator: true,
                            places: 2
                          }
                        }
                      ]
                }
                ,{
                    type: "media", //mediaContent for pieChart in popup
                    mediaInfos: [{
                        title: " <b> Powierzchnia dachu w zależności od nachylenia<b>",
                        type: "pie-chart",
                        caption: "Wykres kołowy ilustrujący jaką cześć dachu stanowi nachylenie w podanych wyżej przedziałach",
                        value: ({
                            fields: ["area_sl0_5","area_sl5_1","area_sl10_","area_sl15_", "area_sl_35"], // <---- uwazac na zmiane atrybutow !!
                            //tooltipField: "tooltipField"
                        })
                    }]
                }
                ]
                };
                view. popup.dockOptions = {
                    buttonEnabled: true,
                    breakpoint: {
                        width: 300,
                        height: 500
                    }
//                    featureNavigationEnabled : true
                };

// ----------------------   R E N D E R E R S  --------------------

//                function for symbols in renderer
                function symbol(color) {
                    return {
                        type: 'mesh-3d',
                        symbolLayers:[
                        {
                            type: "fill",
                            material: {color:color},
                            edges: {
                                type: "solid",
                                color: "#000000",
                                size: 0.3
                            }
                        }]
                    };
                }
//                zdefiniowanie renderera do wyswietlania 6 kategorii
                function categoryRenderer() {
                    return {
                        type: "unique-value",  // autocasts as new UniqueValueRenderer()
                        legendOptions:{
                            title: "Kategorie nachylenia dachów"
                        },
                        field: "category",// <-------- uwazac gdy zmieni sie nazwa atrybutu !

                        uniqueValueInfos: [
                        {

                            value: "1",
                            label: "Kategoria 1 - nachylenie dachu w całości w zakresie 0-15 st",
                            symbol: symbol("#1a9850")
                          },
                          {
                            value: "2",
                            label: "Kategoria 2 - naczylenie dachu w zakresie od 0-35 stopni",
                            symbol: symbol("#66bd63")
                          },
                          {
                            value: "3",
                            label: "Kategoria 3 - część powierzchni dachu 0-15 st oraz powyżej 35 stopni",
                            symbol: symbol("#a6d96a")
                          },
                          {

                            value: "0",
                            label: "Kategoria 0 - zawiera elementy dachów w każdym zakresie",
                            symbol: symbol("#ffffbf")
                          },
                          {

                            value: "4",
                            label: "Kategoria 4 - nachylenie dachu w całości w zakresie 15-35 stopni",
                            symbol: symbol("#fee08b")
                          },
                          {

                            value: "5",
                            label: "Kategoria 5 - nachylenie dachu  powyżej 15 stopni",
                            symbol: symbol("#fdae61")
                          }, {

                            value: "6",
                            label: "Kategoria 6 - nachylenie dachu w całości większe od 35 stopni ",
                            symbol: symbol("#d73027")
                         }]
                    }
                };
                var Green = "#1a9850";
                var Yellow = "#FFEB78";
                var Red = "#801103";

                function usefulnessRenderer() {
                    return {
                        type: "unique-value",
                        legendOptions:{
                            title: "Przydatność dachów"
                        },
                        fieldLabel: "Przydatnośc budynku",
                        field: "category2",
                        uniqueValueInfos:[
                        {
                            label: "przydatny",
                            symbol: symbol(Green),
                            value: "1"
                        },
                        {
                            label: "w ograniczonym zakresie",
                            symbol: symbol(Yellow),
                            value: "2"
                        },
                        {
                            label: "nieprzydatny",
                            symbol: symbol(Red),
                            value: "0"
                        }]
                        }
                };

                //third renderer
                function areaRenderer () {
                    return {
                        type: "simple",
                        symbol: symbol("#FFFFFF"),
                        visualVariables: {
                            title: "Powierzchnia budynków o potencjale do zazielenienia",
                            field: "area_1_sum",
                            type: "color",
                            legendOptions:{
                            title: "Powierzchnia dachów z potencjałem do zazielenienia"
                            },
                            stops: [
                            {
                                color: "#FFFFFF",
                                value: 0 //nie można tutaj używać funkcji od 2016, wprowadzili Arcade
                            },
                            {
                                color: "#410EE6",
                                value: 1200
                            }
                            ]
                        }
                    }
                };


//-----------------------C H A R T S ---------------------------------------------------------------------------
//                First chart


                var definition1 = {
                  "type": "pie",
                  "datasets": [
                    {
                      "url": url,
                      "query": {
                        "orderByFields": "category2",
                        "groupByFieldsForStatistics": "category2",
                        "outStatistics":
                        [
                          {
                            "statisticType": "count",
                            "onStatisticField": "category2",
                            "outStatisticFieldName": "kategoria2"
                          }
                        ]
                      }
                    }
                  ],
                  "series": [
                    {
                      "category": {"field": "category2", "label": "Kategoria"},
                      "value": {
                        "field": "kategoria2",
                        "label": "Liczność"
                      }
                    }
                  ],
                  "style": {
                    "colors": [Red, Green, Yellow],
                    "pie":{
                        "expand": 10,
                        "innerRadius": 15
                    }
                  }

                };
                var cedarChart1 = new cedar.Chart('chartDiv1', definition1);
                cedarChart1.show();


//                Second chart
                var definition2 = {
                  "type": "bar",
                  "datasets": [
                    {
                      "url": url,
                      "query": {
                        "orderByFields": "category",
                        "groupByFieldsForStatistics": "category",
                        "outStatistics":
                        [
                          {
                            "statisticType": "count",
                            "onStatisticField": "category",
                            "outStatisticFieldName": "kategoria"
                          }
                        ]
                      }
                    }
                  ],
                  "series": [
                    {
                      "category": {"field": "category", "label": "Kategoria"},
                      "value": {
                        "field": "kategoria",
                        "label": "Liczność"
                      }
                    }
                  ],
                  "style": { "colors": ["#E39E6D"] }

                };
                var cedarChart2 = new cedar.Chart('chartDiv2', definition2);
                cedarChart2.show();

                function slopeRenderer (field) {
                return {
                    type: "simple",
                    symbol: symbol("FFFFFF"),
                    visualVariables: {
                        title: "Powierzchnia budynków o potencjale do zazielenienia",
                        field: field,
                        type: "color",
                        legendOptions:{
                        title: "Powierzchnia dachów z potencjałem do zazielenienia"
                        },
                        stops: [
                        {
                            color: "#FFFFFF",
                            value: 0 //nie można tutaj używać funkcji od 2016, wprowadzili Arcade
                        },
                        {
                            color: "##bdd7e7",
                            value: 500
                        },
                        {
                            color: "#6baed6",
                            value: 1000
                        },
                        {
                            color: "#3182bd",
                            value: 1500
                        },
                        {
                            color: "#08519c",
                            value: 2000
                        }
                        ]
                        }
                }
                };





//--------------------------------------------------------------------------------


//            SceneLayer from REST API ---> Scene Layer 3D Object
//            important thing is: renderers and popup before declaring sceneLayer
                var buildingsLayer1 = new SceneLayer({
                    portalItem:{
                        id: portalItemSceneId
                    },
                    title: "Budynki 3D Bronowice",
                    popupTemplate: popupTemplate2
                });
                buildingsLayer1.renderer = {
                  type: "simple",  // autocasts as new SimpleRenderer()
                  symbol: {
                    type: "mesh-3d",  // autocasts as new MeshSymbol3D()
                    symbolLayers: [{
                      type: "fill",  // autocasts as new FillSymbol3DLayer()
                      material: { color: "light-grey" },
                      edges: {
                        type: "solid",
                        color: [0, 0, 0, 0.6],
                        size: 0.5
                      }
                    }]
                  }
                };
                scene.add(buildingsLayer1);


//                defining buttons and renderers ALL DONE

                function applyCategoryRenderer (){
                    return buildingsLayer1.renderer = categoryRenderer();
                };
                function applyUsefulnessRenderer (){
                    return buildingsLayer1.renderer = usefulnessRenderer();
                };
                function applyAreaRenderer (){
                    return buildingsLayer1.renderer = areaRenderer();
                };
                var e = document.querySelector('#slopeSelect');
                function applySlopeRenderer (){
                    var strUser = e.options[e.selectedIndex].value;
                    return buildingsLayer1.renderer = slopeRenderer(strUser);
                };
                document.querySelector('#applyCategoryRenderer').addEventListener("click",applyCategoryRenderer, false);
                document.querySelector('#applyUsefulnessRenderer').addEventListener("click",applyUsefulnessRenderer, false);
                document.querySelector('#applyAreaRenderer').addEventListener("click",applyAreaRenderer, false);
                e.addEventListener("change",applySlopeRenderer, false);


//                defining  widgets
                var search = new Search({
                  view: view
                });
                view.ui.add(search, "top-right");

                var zoom = new Zoom({
                  view: view
                });

//                view.ui.add(zoom,"top-left");
                var toggle = new BasemapToggle({
                  view: view, // view that provides access to the map's basemap
                  nextBasemap: "osm"// allows for toggling to the 'hybrid' basemap
                });


                var daylight = new Daylight({
                  view: view,
                  visibleElements: {
                    timezone: false,
                    datePicker: false,
                    playButtons: false,
                    shadowsToggle: true
                  }
                });
//                view.ui.add(daylight, "bottom-right");
                var legend = new Legend({
                  view: view,
                  title: "Legenda"
                });
               view.ui.add(legend, "bottom-left");
               view.ui.add(toggle, "bottom-left");

                var homeWidget = new Home({
                    view: view
                });
//                view.ui.add(homeWidget, "top-left");
        }
    });
});
