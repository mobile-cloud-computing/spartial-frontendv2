import React from "react";

interface ImageDisplayProps {
    imageUrl: string | null;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({imageUrl}) => {
    return (
        <div>
            {imageUrl && (
                <img
                    src={`data:image/png;base64,${process.env.PUBLIC_URL}/Logo.png`}
                    alt="Image"
                    style={{width: "100%", height: "100%", objectFit: "cover"}}
                />
            )}
            {!imageUrl && <p>No image to display</p>}
        </div>
    );
};

export default ImageDisplay;
