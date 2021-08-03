import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda';
import { S3 } from 'aws-sdk'

const s3 = new S3();
const bucketName = process.env.PHOTO_BUCKET_NAME!;

async function generateUrl(object: S3.Object): Promise<{filename:string, url:string}> {
    const url = await s3.getSignedUrlPromise('getObject', {
        Bucket: bucketName,
        Key: object.Key,
        Expires: (24 * 60 * 60)
    });
    return {
        filename: object.Key!,
        url
    }
}

async function getPhotos(event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyStructuredResultV2> {
    try {
        const {Contents: results} = await s3.listObjects({Bucket: bucketName}).promise();
        const photos = await Promise.all(results!.map(result => generateUrl(result)))
        return {
            statusCode: 200,
            body: JSON.stringify(photos)
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: error.message
        }
    }
}

async function getOnePhoto(event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyStructuredResultV2> {
    try {
        const { photoName } = event.pathParameters!;
        const {Contents: results} = await s3.listObjects({Bucket: bucketName}).promise();
        const result = results!.find(result => result.Key == photoName);

        if(!result) {
            return {
                statusCode: 404,
                body: "Result not found",
            }
        }
        const photo = await generateUrl(result);
        return {
            statusCode: 200,
            body: JSON.stringify(photo)
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: error.message
        }
    }
}

export {getPhotos, getOnePhoto}