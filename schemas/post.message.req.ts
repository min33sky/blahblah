const PostMessageReq = {
  additionalProperties: false,
  properties: {
    uid: {
      type: 'string',
    },
    message: {
      type: 'string',
    },
    author: {
      properties: {
        displaynAME: {
          type: 'string',
        },
        photoURL: {
          type: 'string',
        },
      },
      required: ['displayName'],
    },
  },
  required: ['uid', 'message'],
};

export default PostMessageReq;
