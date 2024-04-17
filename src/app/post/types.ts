export const types = `#graphql
    input CreatePostData{
        content: String!
        imageUrl: String
    }
    
    type Post{
        id: ID!
        content: String!
        imageUrl: String
        
        owner: User!
    }
`