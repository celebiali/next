import { getMdxNode, getMdxPaths } from 'next-mdx/server'
import { useHydrate } from 'next-mdx/client'
import { mdxComponents } from '../../components/mdx-components'
import { useAuth0 } from '@auth0/auth0-react'
import { useState ,useEffect } from 'react'
import Form from '../../components/form'
import {DateTime} from 'luxon'

export default function PostPage({ post }) {
  const {getAccessTokenSilently} = useAuth0();
  const [text, textSet] = useState("")
  const [url, urlSet] = useState(null)
  const [comments, commentsSet] = useState([])


  const fetchComment = async () => {
    const query = new URLSearchParams({url})
    const newUrl = `/api/comment?${query.toString()}`
    const response = await fetch(newUrl, {
      method: 'GET'
    })
    const data = await response.json()
    commentsSet(data)
  }
  useEffect(()=> {
    if(!url) return
    fetchComment()
  },[url])

  useEffect(() => {
    const url = window.location.origin + window.location.pathname
    urlSet(url)

  },[])
  const content = useHydrate(post, {
    components: mdxComponents
  })

  const onSubmit = async (e)=> {
    e.preventDefault()
    const userToken = await getAccessTokenSilently()

    const response = await fetch("/api/comment",{
      method: "POST",
      body: JSON.stringify({text, userToken, url}),
      headers: {
        'Content-Type':'application/json'
      }
    })
    const data = await response.json()
    fetchComment()
    textSet('')
  }

  return (
    <div className="site-container">
      <article className="prose">
        <h1 >{post.frontMatter.title}</h1>
        <p>{post.frontMatter.excerpt}</p>
        <hr />
        <div>{content}</div>
      </article>
    <Form onSubmit={onSubmit} textSet={textSet} text={text}/>
    <div className="mt-10 space-y-4">
      {comments.map(({ id, createdAt, text, user }) => {
            return <div className="flex items-center space-x-2">
              <img src={user.picture} alt={user.name} width={50} className="rounded-full"/>
            <div>
              <div>
                <b>{user.name}</b>
                <time>{DateTime.fromMillis(createdAt).toRelative()}</time>
              </div>
            <p>{text}</p>
            </div>
            </div>
        })
      }
    </div>

   </div>
  )
}

export async function getStaticPaths() {
  return {
    paths: await getMdxPaths('post'),
    fallback: false
  }
}

export async function getStaticProps(context) {
  const post = await getMdxNode('post', context)

  if (!post) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      post
    }
  }
}