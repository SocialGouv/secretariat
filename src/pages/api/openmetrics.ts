import { NextApiRequest, NextApiResponse } from "next"
import graphQLFetcher from "@/utils/graphql-fetcher"

// return Object.keys but typed from T
function keysOf<T extends Object>(obj: T): Array<keyof T> {
  return Array.from(Object.keys(obj)) as any
}

const queries = {
  total_user_count: {
    comment:
      "# HELP total_user_count Nombre total d'utilisateurs\n" +
      "# TYPE total_user_count counter",
    query: `
query {
  users_aggregate {
    aggregate {
      count
    }
  }
}`,
  },
  expired_user_count: {
    comment:
      "# HELP expired_user_count Nombre total d'utilisateurs\n" +
      "# TYPE expired_user_count counter",
    query: `
query {
  users_aggregate(where: {departure: {_lte: "today()"}}) {
    aggregate {
      count
    }
  }
}`,
  },
  no_expiration_user_count: {
    comment:
      "# HELP no_expiration_user_count Nombre total d'utilisateurs sans date d'expiration\n" +
      "# TYPE no_expiration_user_count counter",
    query: `
query {
  users_aggregate(where: {departure: {_is_null: true}}) {
    aggregate {
      count
    }
  }
}`,
  },
}

const getMetrics = async () =>
  Promise.all(
    keysOf(queries).map(
      (key) =>
        graphQLFetcher({
          query: queries[key].query,
        }).then((res: any) => ({
          name: key,
          value: res?.users_aggregate.aggregate.count,
          comment: queries[key].comment,
        })) as Promise<{ name: string; value: number; comment: string }>
    )
  )

const OpenMetrics = async (req: NextApiRequest, res: NextApiResponse) => {
  const metrics = await getMetrics()
  console.log("metrics", metrics)
  const text = metrics
    .map(
      ({ name, value, comment }) =>
        `${comment ? comment + "\n" : ""}${name}\t${value}`
    )
    .join("\n\n")
  console.log(text)
  res.status(200).send(text)
}

export default OpenMetrics
