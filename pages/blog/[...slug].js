import { getMdxNode, getMdxPaths } from 'next-mdx/server'
import { useHydrate } from 'next-mdx/client'
import { mdxComponents } from '../../components/mdx-components'

export default function PostPage({ post }) {

  const content = useHydrate(post, {
    components: mdxComponents
  })

  return (
    <div className="site-container">
      <article className="prose">
        <h1 >{post.frontMatter.title}</h1>
        <p>{post.frontMatter.excerpt}</p>
        <hr />
        <div>{content}</div>
      </article>

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