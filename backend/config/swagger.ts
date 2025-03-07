import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mini Blog API",
      description:
        "API endpoints for a mini blog services documented on swagger",
      version: "1.0.0",
    },
    components:{
      securitySchemes:{
        bearerAuth:{
          type:'http',
          scheme:'bearer',
          bearerFormat:'JWT'
        }
      }
    },
    security:[
      {
        bearerAuth:[]
      }
    ],
    servers: [
      {
        url: "http://localhost:3001/",
        description: "Local server",
      },
    ],
  },
  // looks for configuration in specified directories
  apis: [path.resolve(__dirname + "/../routes/route.ts")],
};
const swaggerSpec = swaggerJsdoc(options);
function swaggerDocs(app: any, port: any) {
  // console.log(options);
  // Swagger Page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Documentation in JSON format
  app.get("/docs.json", (req: any, res: any) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}
export default swaggerDocs;
