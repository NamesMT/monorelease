import type { RawGitCommit } from 'changelogen'
import { execCommand } from './exec'

export function getGitDiff(from: string | undefined, to = 'HEAD', includePaths: string[]): RawGitCommit[] {
  const r = execCommand(`git --no-pager log "${from ? `${from}...` : ''}${to}" --pretty="----%n%s|%h|%an|%ae%n%b" --name-status -- ${includePaths.join(' ')}`)

  return r
    .split('----\n')
    .splice(1)
    .map((line) => {
      const [firstLine, ..._body] = line.split('\n')
      const [message, shortHash, authorName, authorEmail] = firstLine.split('|')
      const r: RawGitCommit = {
        message,
        shortHash,
        author: { name: authorName, email: authorEmail },
        body: _body.join('\n'),
      }

      return r
    })
}
