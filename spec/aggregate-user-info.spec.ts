import * as aggregate from '../src/aggregate-user-info'
import * as type from '../src/type';
import { dummyData } from './dummy-data';

describe('github-graphql', () => {
    it('fetchData', () => {
        const userInfo = aggregate.aggregateUserInfo(dummyData);

        expect(userInfo.contributionCalendar.length).toEqual(371);

        const languages: Array<type.LangInfo> = [
            {
                "language": "Jupyter Notebook",
                "color": "#DA5B0B",
                "contributions": 108
            },
            {
                "language": "Perl",
                "color": "#0298c3",
                "contributions": 73
            },
            {
                "language": "Kotlin",
                "color": "#F18E33",
                "contributions": 58
            },
            {
                "language": "TypeScript",
                "color": "#2b7489",
                "contributions": 31
            },
            {
                "language": "Java",
                "color": "#b07219",
                "contributions": 28
            },
            {
                "language": "Go",
                "color": "#00ADD8",
                "contributions": 20
            },
            {
                "language": "Python",
                "color": "#3572A5",
                "contributions": 10
            },
            {
                "language": "JavaScript",
                "color": "#f1e05a",
                "contributions": 7
            },
            {
                "language": "C",
                "color": "#555555",
                "contributions": 4
            },
            {
                "language": "Ruby",
                "color": "#701516",
                "contributions": 1
            }
        ];
        expect(userInfo.contributesLanguage).toEqual(languages);

        expect(userInfo.totalContributions).toEqual(366);
        expect(userInfo.totalCommitContributions).toEqual(344);
        expect(userInfo.totalIssueContributions).toEqual(4);
        expect(userInfo.totalPullRequestContributions).toEqual(12);
        expect(userInfo.totalPullRequestReviewContributions).toEqual(0);
        expect(userInfo.totalRepositoryContributions).toEqual(6);
        expect(userInfo.totalForkCount).toEqual(0);
        expect(userInfo.totalStargazerCount).toEqual(6);
        expect(userInfo.streak).toBeDefined();
    });

    describe('calculateStreak', () => {
        const createCalendar = (counts: number[]): type.CalendarInfo[] =>
            counts.map((contributionCount, idx) => ({
                contributionCount,
                contributionLevel: contributionCount > 0 ? 1 : 0,
                date: new Date(2025, 0, 1 + idx),
            }));

        it('handles zero contributions', () => {
            const cal = createCalendar([0, 0, 0, 0]);
            expect(aggregate.calculateStreak(cal)).toEqual({
                current: 0,
                longest: 0,
            });
        });

        it('calculates current streak ending today', () => {
            const cal = createCalendar([0, 1, 1, 2, 3]);
            expect(aggregate.calculateStreak(cal)).toEqual({
                current: 4,
                longest: 4,
            });
        });

        it('calculates current streak ending yesterday (today 0)', () => {
            const cal = createCalendar([0, 1, 2, 3, 0]);
            expect(aggregate.calculateStreak(cal)).toEqual({
                current: 3,
                longest: 3,
            });
        });

        it('resets current streak when last 2+ days are 0', () => {
            const cal = createCalendar([0, 1, 2, 3, 0, 0]);
            expect(aggregate.calculateStreak(cal)).toEqual({
                current: 0,
                longest: 3,
            });
        });

        it('calculates longest streak distinct from current streak', () => {
            const cal = createCalendar([1, 2, 3, 4, 5, 0, 0, 1, 2]);
            expect(aggregate.calculateStreak(cal)).toEqual({
                current: 2,
                longest: 5,
            });
        });
    });
});
