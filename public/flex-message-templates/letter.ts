export const letter = {
  type: "bubble",
  body: {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "image",
        url: "https://line-love.vercel.app/flex-images/birthday.png",
        size: "full",
        aspectMode: "cover",
        aspectRatio: "3:2",
        gravity: "top",
      },
      {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "open letter",
            style: "italic",
            color: "#ffffff",
            decoration: "none",
            align: "center",
            size: "10px",
            offsetTop: "0px",
          },
        ],
        position: "absolute",
        offsetBottom: "0px",
        offsetStart: "0px",
        offsetEnd: "0px",
        backgroundColor: "#03303Acc",
        paddingAll: "10px",
        paddingTop: "2px",
        paddingBottom: "2px",
      },
    ],
    paddingAll: "0px",
    action: {
      type: "uri",
      label: "action",
      uri: "https://birthday-seven-amber.vercel.app/",
    },
  },
};
