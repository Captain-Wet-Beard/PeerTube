import { Sequelize } from 'sequelize'
import { BuildVideoGetQueryOptions } from '../video-model-get-query-builder'
import { AbstractVideosModelQueryBuilder } from './abstract-videos-model-query-builder'

/**
 *
 * Fetch files (webtorrent and streaming playlist) according to a video
 *
 */

export class VideoFileQueryBuilder extends AbstractVideosModelQueryBuilder {
  protected attributes: { [key: string]: string }
  protected joins: string[] = []

  constructor (protected readonly sequelize: Sequelize) {
    super('get')
  }

  queryWebTorrentVideos (options: BuildVideoGetQueryOptions) {
    this.buildWebtorrentFilesQuery(options)

    return this.runQuery(options.transaction, true)
  }

  queryStreamingPlaylistVideos (options: BuildVideoGetQueryOptions) {
    this.buildVideoStreamingPlaylistFilesQuery(options)

    return this.runQuery(options.transaction, true)
  }

  private buildWebtorrentFilesQuery (options: BuildVideoGetQueryOptions) {
    this.attributes = {
      '"video"."id"': ''
    }

    this.includeWebtorrentFiles(true)

    if (options.forGetAPI === true) {
      this.includeWebTorrentRedundancies()
    }

    this.whereId(options.id)

    this.query = this.buildQuery()
  }

  private buildVideoStreamingPlaylistFilesQuery (options: BuildVideoGetQueryOptions) {
    this.attributes = {
      '"video"."id"': ''
    }

    this.includeStreamingPlaylistFiles(true)

    if (options.forGetAPI === true) {
      this.includeStreamingPlaylistRedundancies()
    }

    this.whereId(options.id)

    this.query = this.buildQuery()
  }

  private buildQuery () {
    return `${this.buildSelect()} FROM "video" ${this.joins.join(' ')} ${this.where}`
  }
}
